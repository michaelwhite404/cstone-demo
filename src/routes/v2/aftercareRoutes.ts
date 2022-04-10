import { authController as v2auth, aftercareController } from "@controllers/v2";
import { getAllAttendanceEntries } from "@controllers/v2/aftercareController";
import { Router } from "express";

const { getAllAftercareStudents, createAftercareSession, signOutStudent } = aftercareController;

const router = Router();

router.use(v2auth.protect);

router.route("/attendance").get(getAllAttendanceEntries).post();
router.route("/students").get(getAllAftercareStudents).put().post();
router.route("/students/:id");
router.patch("/sign-out/:id", signOutStudent);
router.route("/session").post(createAftercareSession);

export default router;
