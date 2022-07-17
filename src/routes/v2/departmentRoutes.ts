import { Router } from "express";
import * as v1auth from "@controllers/v1/authController";
import { authController as v2auth } from "@controllers/v2";
import { departmentController as dC } from "@controllers/v2";
const { createDepartment, getAllDepartments, getOneDepartment, updateDepartment } = dC;

const router = Router();

router.use(v2auth.protect);
router.use(v1auth.restrictTo("Super Admin", "Admin"));

router.route("/").get(getAllDepartments).post(createDepartment);

router.route("/:id").get(getOneDepartment).patch().delete();
const updateRoutes: string[] = [];
// prettier-ignore
["leaders", "approvers", "employees"].forEach(function (key) {["add", "remove"].forEach(function (op) {updateRoutes.push(`/:id/${op}-${key}`);});});
router.patch(updateRoutes, updateDepartment);

export default router;
