import { authController as v2auth } from "@controllers/v2";
import { getAllAftercareStudents } from "@controllers/v2/aftercareController";
import { Router } from "express";

const router = Router();

router.use(v2auth.protect);

router.route("/attendance").get().post();
router.route("/students").get(getAllAftercareStudents).put().post();
router.route("/students/:id")
router.route("/session");

export default router;
