import { Student } from "@models";
import { AftercareSession, AftercareAttendanceEntry } from "@models";
import { AppError, catchAsync } from "@utils";
import * as factory from "./handlerFactory";

export const getAllAftercareStudents = factory.getAll(Student, "students", { aftercare: true });

// export const addAftercareStudent = catchAsync(async (req, res, next) => {
//   Student.find;
// });

export const createAftercareSession = catchAsync(async (req, res, next) => {
  if (await AftercareSession.sessionExistsToday())
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

  res.sendJson(201, {
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
  });
});

export const getAllAttendanceEntries = factory.getAll(AftercareAttendanceEntry, "entries");

export const signOutStudent = catchAsync(async (req, res, next) => {
  const entry = await AftercareAttendanceEntry.findById(req.params.id);
  if (!entry) return next(new AppError("There is no entry with this id", 404));
  entry.signOutDate = new Date();
  entry.lateSignOut = new Date().getHours() >= 18;
  await entry.save();
  res.sendJson(200, {
    entry,
  });
});
