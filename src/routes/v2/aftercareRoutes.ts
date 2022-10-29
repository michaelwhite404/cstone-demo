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
  getSessionToday,
  getAllAftercareSessions,
  getAftercareSession,
  addDateToParams,
  getAttendanceStats,
} = aftercareController;

const router = Router();

router.use(v2auth.protect);

router.route("/attendance").get(getAllAttendanceEntries).post(createAttendanceEntries);
router.get("/attendance/stats", getAttendanceStats);
router.route("/attendance/:id").get(getAftercareEntryById);
router.get(
  "/attendance/year/:year/month/:month/day/:day",
  addDateToParams,
  getAllAttendanceEntries
);
router.patch("/attendance/sign-out/:id", signOutStudent);
router
  .route("/students")
  .get(getAllAftercareStudents)
  .patch(modifyAftercareStudentStatus)
  .put(putAftercareStudentStatus);
// .post();

// router.route("/students/:id");
router.route("/session").get(getAllAftercareSessions).post(createAftercareSession);
router.get("/session/today", getSessionToday);
router.get("/session/:id", getAftercareSession);

export default router;
