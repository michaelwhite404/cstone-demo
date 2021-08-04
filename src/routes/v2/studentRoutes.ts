import { Router } from "express";
import * as studentController from "../../controllers/v2/studentController";

const studentRouter = Router();

studentRouter
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.createStudent);

studentRouter
  .route("/:id")
  .get(studentController.getOneStudent)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent);

export default studentRouter;
