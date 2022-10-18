import { Request, Response } from "express";
import { Student } from "@models";
import { AppError, catchAsync, isObjectID } from "@utils";
import { handlerFactory as factory } from ".";

const Model = Student;
const key = "student";

/** `GET` - Gets all students */
export const getAllStudents = factory.getAll(Student, `${key}s`);
/** `GET` - Gets a single student */
export const getOneStudent = catchAsync(async (req, res, next) => {
  let query = isObjectID(req.params.id.toString())
    ? Model.findById(req.params.id)
    : Model.findOne({ slug: req.params.id });

  const student = await query.populate([
    {
      path: "textbooks",
      select: "textbookSet quality bookNumber teacherCheckOut -lastUser",
      populate: {
        path: "teacherCheckOut textbookSet",
        select: "fullName email title class",
      },
    },
    {
      path: "devices",
      select: "status name brand deviceType slug -checkouts",
    },
  ]);

  if (!student) {
    return next(new AppError("There is no student with this id", 404));
  }
  const { id, __v, ...s } = student.toJSON();

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      student: { ...s },
    },
  });
});

/** `POST` - Creates a single student */
export const createStudent = catchAsync(async (req, res, next) => {
  const { password, ...body } = req.body;
  if (!(password && typeof password === "string" && password.length >= 8)) {
    return next(new AppError("A student must have a password with at least 8 characters.", 400));
  }
  const student = await Model.create(body);
  res.sendJson(201, {
    student,
  });
});

/** `PATCH` - Updates a single student */
export const updateStudent = factory.updateOne(Model, key);
/** `DELETE` - Deletes student */
export const deleteStudent = factory.deleteOne(Model, "Student");

export const groupStudentsByGrade = catchAsync(async (_: Request, res: Response) => {
  const grades = await Student.aggregate([
    { $match: { status: "Active" } },
    {
      $sort: { lastName: 1 },
    },
    {
      $group: {
        _id: "$grade",
        count: { $sum: 1 },
        students: { $push: { id: "$_id", fullName: "$fullName" } },
      },
    },
    {
      $project: {
        grade: "$_id",
        students: 1,
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { grade: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      grades,
    },
  });
});
