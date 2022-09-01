import { Router } from "express";
import * as v1auth from "@controllers/v1/authController";
import { authController as v2auth } from "@controllers/v2";
import { departmentController as dC } from "@controllers/v2";
import memberRouter from "./departmentMemberRoutes";
const { createDepartment, getAllDepartments, getOneDepartment } = dC;

const router = Router();

router.use(v2auth.protect);
router.use(v1auth.restrictTo("Super Admin", "Admin"));

router.use("/:departmentId/members", memberRouter);

router.route("/").get(getAllDepartments).post(createDepartment);

router.route("/:id").get(getOneDepartment).patch().delete();

export default router;
