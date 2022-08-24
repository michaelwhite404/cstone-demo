import { Router } from "express";
import { employeeController, authController as v2auth } from "@controllers/v2";
import * as v1auth from "@controllers/v1/authController";

const employeeRouter = Router();

employeeRouter.post("/login", v2auth.login);
employeeRouter.post("/logout", v1auth.logout);
employeeRouter.post("/google", v2auth.googleLogin);
// employeeRouter.post("/forgot-password", v1auth.forgotPassword); // TODO: Re-do method
// router.patch("/reset-password/:token", v1auth.resetPassword);  // TODO: Re-do method
employeeRouter.patch("/spaces", v2auth.gChatProtect, employeeController.addToSpace);

employeeRouter.use(v2auth.protect);

employeeRouter.patch("/update-password", v2auth.protect, v1auth.updatePassword);

employeeRouter.route("/").get(employeeController.getAllEmployees).post(v2auth.createEmployee);
employeeRouter.route("/me").get(employeeController.getMe, employeeController.getOneEmployee);
employeeRouter.get("/from-google", employeeController.getGoogleUsers);
employeeRouter
  .route("/:id")
  .get(employeeController.getOneEmployee) /* .patch(employeeController.updateUser) */;

export default employeeRouter;
