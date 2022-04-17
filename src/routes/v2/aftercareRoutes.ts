import { authController as v2auth, aftercareController } from "@controllers/v2";
import { Router } from "express";

const {
  getAllAftercareStudents,
  createAftercareSession,
  signOutStudent,
  modifyAftercareStudentStatus,
  putAftercareStudentStatus,
  createAttendanceEntries,
  getAllAttendanceEntries,
  getAftercareEntryById,
  getActiveSession,
} = aftercareController;

const router = Router();

router.use(v2auth.protect);

router.route("/attendance").get(getAllAttendanceEntries).post(createAttendanceEntries);
router.route("/attendance/:id").get(getAftercareEntryById);
router.patch("/attendance/sign-out/:id", signOutStudent);
router
  .route("/students")
  .get(getAllAftercareStudents)
  .patch(modifyAftercareStudentStatus)
  .put(putAftercareStudentStatus);
// .post();

// router.route("/students/:id");
router.route("/session").post(createAftercareSession);
router.get("/session/active", getActiveSession);

export default router;
