import { Router } from "express";
import { departmentMemberController } from "@controllers/v2";

const {
  getAllDepartmentMembers,
  createDepartmentMember,
  addDepartmentIdToBody,
  getDepartmentMember,
  removeDepartmentMember,
} = departmentMemberController;

const memberRouter = Router({ mergeParams: true });

memberRouter
  .route("/")
  .get(getAllDepartmentMembers)
  .post(addDepartmentIdToBody, createDepartmentMember);

memberRouter.route("/:id").get(getDepartmentMember).delete(removeDepartmentMember);

export default memberRouter;
