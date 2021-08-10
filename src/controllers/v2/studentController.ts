import Student from "../../models/studentModel";
import * as factory from "./handlerFactory";

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
