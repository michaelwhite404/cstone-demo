import { Router } from "express";
import * as v1auth from "../../controllers/v1/authController";
import {
  createDepartment,
  getAllDepartments,
  getOneDepartment,
  updateDepartment,
} from "../../controllers/v2/departmentController";

const router = Router();

router.use(v1auth.protect);

router
  .route("/")
  .get(getAllDepartments)
  .post(v1auth.restrictTo("Super Admin", "Admin"), createDepartment);

router.route("/:id").get(getOneDepartment).patch().delete();
const updateRoutes: string[] = [];
// prettier-ignore
["leaders", "approvers", "employees"].forEach(function (key) {["add", "remove"].forEach(function (op) {updateRoutes.push(`/:id/${op}-${key}`);});});
router.patch(updateRoutes, updateDepartment);

export default router;
