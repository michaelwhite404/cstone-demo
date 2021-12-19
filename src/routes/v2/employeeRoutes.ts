import { Router } from "express";
import * as employeeController from "../../controllers/v2/employeeController";
import * as v1auth from "../../controllers/v1/authController";
import * as v2auth from "../../controllers/v2/authController";

const employeeRouter = Router();

employeeRouter.post("/login", v1auth.login);
employeeRouter.post("/logout", v1auth.logout);
employeeRouter.post("/google", v2auth.googleLogin);
// employeeRouter.post("/forgot-password", v1auth.forgotPassword); // TODO: Re-do method
// router.patch("/reset-password/:token", v1auth.resetPassword);  // TODO: Re-do method

employeeRouter.use(v2auth.protect);
employeeRouter.patch("/update-password", v1auth.updatePassword);

employeeRouter.route("/").get(employeeController.getAllEmployees).post(v2auth.createEmployee);
employeeRouter.route("/me").get(employeeController.getMe, employeeController.getOneEmployee);
employeeRouter
  .route("/:id")
  .get(employeeController.getOneEmployee) /* .patch(employeeController.updateUser) */;

export default employeeRouter;
