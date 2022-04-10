import { authController as v2auth, aftercareController } from "@controllers/v2";
import { Router } from "express";

const { getAllAftercareStudents, createAftercareSession } = aftercareController;

const router = Router();

router.use(v2auth.protect);

router.route("/attendance").get().post();
router.route("/students").get(getAllAftercareStudents).put().post();
router.route("/students/:id");
router.route("/session").post(createAftercareSession);

export default router;
