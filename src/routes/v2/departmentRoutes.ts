import { Router } from "express";
import * as v1auth from "../../controllers/v1/authController";
import {
  createDepartment,
  getAllDepartments,
  getOneDepartment,
} from "../../controllers/v2/departmentController";

const router = Router();

router.use(v1auth.protect);

router
  .route("/")
  .get(getAllDepartments)
  .post(v1auth.restrictTo("Super Admin", "Admin"), createDepartment);

router.route("/:id").get(getOneDepartment).patch().delete();

// router.route("/:id/add-leader")

// router.route("/:id/add-approver");

export default router;
