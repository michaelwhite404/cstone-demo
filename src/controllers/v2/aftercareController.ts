import { Student } from "@models";
import { AftercareSession, AftercareAttendanceEntry } from "@models";
import { StudentModel } from "@@types/models";
import { AppError, catchAsync, isObject, isObjectID } from "@utils";
import { FilterQuery, Types, UpdateQuery } from "mongoose";
import * as factory from "./handlerFactory";
import pluralize from "pluralize";
import s3 from "@utils/s3";
import { RequestHandler } from "express";
import validator from "validator";
import { addDays } from "date-fns";
import { io } from "@server";

export const getAllAftercareStudents = factory.getAll(Student, "students", { aftercare: true });

export const modifyAftercareStudentStatus = catchAsync(async (req, res, next) => {
  if (!req.body.data || !Array.isArray(req.body.data))
    return next(new AppError("There must be an array of data", 400));

  const bodyData: any[] = req.body.data;

  if (!bodyData.every((obj) => isObject(obj) && "id" in obj && "op" in obj))
    return next(new AppError("Each object should have an `id` and `op` property", 400));
  const filteredData = bodyData.filter(
    (obj) => isObjectID(obj.id) && ["add", "remove"].includes(obj.op)
  );
  // Good to go

  const writes = filteredData.map((obj) => ({
    updateOne: {
      filter: {
        _id: new Types.ObjectId(obj.id),
      } as FilterQuery<StudentModel>,
      update: {
        aftercare: obj.op === "add" ? true : false,
      } as UpdateQuery<StudentModel>,
    },
  }));

  const result = await Student.bulkWrite(writes);

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    message: `${pluralize("status", result.modifiedCount, true)} updated`,
  });
});

export const putAftercareStudentStatus = catchAsync(async (req, res, next) => {
  if (!req.body.students || !Array.isArray(req.body.students))
    return next(new AppError("There must be an array of student ids", 400));

  const bodyStudents: any[] = req.body.students;

  if (!bodyStudents.every((student) => typeof student === "string"))
    return next(new AppError("Each id in the student array must be a string", 400));

  const filteredStudentIds: string[] = bodyStudents.filter((id) => isObjectID(id));

  await Student.updateMany({}, { aftercare: false });

  const result = await Student.updateMany(
    { _id: { $in: filteredStudentIds } },
    { aftercare: true }
  );

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    message: `${pluralize("status", result.nModified, true)} updated`,
  });
});

export const createAftercareSession = catchAsync(async (req, res, next) => {
  if (await AftercareSession.sessionToday())
    return next(new AppError("A session already exists today", 400));

  if (!req.body.students || !Array.isArray(req.body.students))
    return next(new AppError("There must be an array of student ids to create a session", 400));

  const bodyStudents: any[] = req.body.students;

  if (!bodyStudents.every((student) => typeof student === "string"))
    return next(new AppError("Each id in the student array must be a string", 400));

  const students = await Student.find({ _id: { $in: bodyStudents }, status: "Active" });

  const session = await AftercareSession.create({
    date: new Date().toISOString(),
    active: true,
    numAttended: students.length,
    dropIns: students.filter((s) => !s.aftercare).length,
  });

  const entryArray = students.map((student) => ({
    student,
    session,
    dropIn: !student.aftercare,
  }));

  const attendance = await AftercareAttendanceEntry.create(entryArray);
  const data = {
    session,
    attendance: attendance.map((entry) => ({
      _id: entry._id,
      student: {
        _id: entry.student._id,
        fullName: entry.student.fullName,
        schoolEmail: entry.student.schoolEmail,
      },
      dropIn: entry.dropIn,
    })),
  };

  io.emit("aftercareSessionStart", data);
  res.sendJson(201, data);
});

export const getAllAttendanceEntries = factory.getAll(
  AftercareAttendanceEntry,
  "entries",
  {},
  {
    path: "student",
    select: "fullName schoolEmail grade",
  }
);

export const getAftercareEntryById = factory.getOneById(AftercareAttendanceEntry, "entry", {
  path: "student",
  select: "fullName",
});

export const signOutStudent = catchAsync(async (req, res, next) => {
  const entry = await AftercareAttendanceEntry.findById(req.params.id).populate({
    path: "student",
    select: "fullName schoolEmail",
  });
  if (!entry) return next(new AppError("There is no entry with this id", 404));
  if (entry.signOutDate) return next(new AppError("This student has already been signed out", 400));
  const data = await s3.uploadBase64Image(req.body.signature, `signatures/aftercare/${entry._id}`);
  entry.signOutDate = new Date();
  entry.lateSignOut = new Date().getHours() >= 18;
  entry.signature = data.Key;
  await entry.save();
  res.sendJson(200, {
    entry,
  });
  io.emit("aftercareSignOutSuccess");
});

export const createAttendanceEntries = catchAsync(async (req, res, next) => {
  const session = await AftercareSession.sessionToday();
  if (!session) return next(new AppError("No session has been created today.", 400));
  if (!session.active)
    return next(new AppError("Entries cannot be added after a session is over", 400));
  // Array of student ids
  if (!req.body.students || !Array.isArray(req.body.students))
    return next(new AppError("There must be an array of student ids to create a session", 400));

  const bodyStudents: any[] = req.body.students;

  if (!bodyStudents.every((id) => typeof id === "string" && isObjectID(id)))
    return next(new AppError("Each id in the student array must be a string ObjectId", 400));

  const [sessionEntries, students] = await Promise.all([
    AftercareAttendanceEntry.find({ session: session._id }),
    Student.find({ _id: { $in: bodyStudents } }),
  ]);

  const sessionEntriesStudentIds = sessionEntries.map((e) => e.student.toString());
  // const studentIds = students.map((s) => s._id.toString());

  const studentsToAdd = students.filter(
    (student) => !sessionEntriesStudentIds.includes(student._id.toString())
  );

  const entries = await AftercareAttendanceEntry.create(
    studentsToAdd.map((student) => ({
      student: student._id,
      session: session._id,
      dropIn: !student.aftercare,
    }))
  );
  io.emit("aftercareAddEntries");
  res.sendJson(200, {
    entries,
  });
});

export const getSessionToday = catchAsync(async (_, res) => {
  const session = await AftercareSession.sessionToday();
  const attendance = session
    ? await AftercareAttendanceEntry.find({ session }).populate({
        path: "student",
        select: "fullName schoolEmail",
      })
    : [];
  res.sendJson(200, {
    session,
    attendance,
  });
});

export const getAllAftercareSessions = factory.getAll(
  AftercareSession,
  "sessions",
  {},
  {
    path: "numAttended dropIns",
  }
);

export const getAftercareSession = factory.getOneById(AftercareSession, "session", {
  path: "numAttended dropIns",
});

export const addDateToParams: RequestHandler = (req, _, next) => {
  let { year, month, day } = req.params;
  if (month.length === 1) month = `0${month}`;
  if (day.length === 1) day = `0${day}`;

  // If date is not valid
  if (!validator.isDate(`${year}-${month}-${day}`, { format: "YYYY/MM/DD" })) {
    return next(new AppError("Invalid Date", 400));
  }
  const date = new Date(+year, +month - 1, +day);
  const nextDay = addDays(date, 1);
  req.query.signOutDate = {
    gte: date.toISOString(),
    lte: nextDay.toISOString(),
  };
  next();
};

export const getAttendanceStats = catchAsync(async (_, res) => {
  const stats = await AftercareAttendanceEntry.aggregate([
    { $match: { signOutDate: { $exists: 1 } } },
    {
      $group: {
        _id: "$student",
        entriesCount: { $sum: 1 },
        lateCount: { $sum: { $cond: ["$lateSignOut", 1, 0] } },
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "_id",
        as: "student",
        pipeline: [{ $project: { fullName: 1, grade: 1, schoolEmail: 1, aftercare: 1 } }],
      },
    },
    {
      $project: {
        _id: 0,
        entriesCount: 1,
        lateCount: 1,
        student: { $arrayElemAt: ["$student", 0] },
      },
    },
  ]);
  res.sendJson(200, { stats });
});
