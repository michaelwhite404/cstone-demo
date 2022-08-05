import { Router } from "express";
import { authController as v2auth, reimbursementController } from "@controllers/v2";
import multer from "multer";

const upload = multer();
const employeeLeaveRouter = Router();

employeeLeaveRouter.use(v2auth.protect);

employeeLeaveRouter
  .route("/")
  .get(reimbursementController.getAllReimbursements)
  .post(upload.single("receipt"), reimbursementController.createReimbursement);

export default employeeLeaveRouter;
