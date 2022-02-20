import { Request, Response } from "express";
import Student from "../../models/studentModel";
import catchAsync from "../../utils/catchAsync";
import { handlerFactory as factory } from ".";

const Model = Student;
const key = "student";

/** `GET` - Gets all students */
export const getAllStudents = factory.getAll(Student, `${key}s`);
/** `GET` - Gets a single student */
export const getOneStudent = factory.getOneById(Model, key, {
  path: "textbooksCheckedOut",
  select: "textbookSet quality bookNumber teacherCheckOut -lastUser",
  populate: {
    path: "teacherCheckOut",
    select: "fullName -_id ",
  },
});
/** `POST` - Creates a single student */
export const createStudent = factory.createOne(Model, key);
/** `PATCH` - Updates a single student */
export const updateStudent = factory.updateOne(Model, key);
/** `DELETE` - Deletes student */
export const deleteStudent = factory.deleteOne(Model, "Student");

export const groupSudentsByGrade = catchAsync(async (_: Request, res: Response) => {
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
