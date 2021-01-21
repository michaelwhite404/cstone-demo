const express = require("express");
const studentController = require("../controllers/studentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.createStudent);

router
  .route("/:id")
  .get(studentController.getStudent)
  .patch(studentController.updateStudent);
// .delete(studentController.deleteStudent);

router.get("/test/group", studentController.groupTest);
module.exports = router;
