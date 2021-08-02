import { Router } from "express";
import * as studentController from "../../controllers/studentController";
import * as authController from "../../controllers/authController";

const router = Router();

router.use(authController.protect);

router.route("/").get(studentController.getAllStudents).post(studentController.createStudent);

router.route("/:id").get(studentController.getStudent).patch(studentController.updateStudent);
// .delete(studentController.deleteStudent);

router.get("/test/group", studentController.groupTest);

export default router;
