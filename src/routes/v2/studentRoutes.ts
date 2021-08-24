import { Router } from "express";
import { protect } from "../../controllers/v1/authController";
import { groupTest } from "../../controllers/v1/studentController";
import * as studentController from "../../controllers/v2/studentController";

const studentRouter = Router();

studentRouter.use(protect);

studentRouter
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.createStudent);

studentRouter.get("/group", groupTest);

studentRouter
  .route("/:id")
  .get(studentController.getOneStudent)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent);

export default studentRouter;
