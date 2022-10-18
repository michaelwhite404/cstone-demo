import { Router } from "express";
import { deviceController, helpers, authController } from "@controllers/v2";

import deviceLogRouter from "./deviceLogRoutes";
import deviceErrorLogRouter from "./deviceErrorLogRoutes";

const { protect, restrictTo } = authController;

const deviceRouter = Router();

const nonManualUpdateKeys = [
  "dueDate",
  "deviceType",
  "checkedOut",
  "lastUser",
  "teacherCheckOut",
  "lastCheckOut",
  "lastCheckIn",
  "slug",
  "status",
];
deviceRouter.use(protect);

deviceRouter.use("/logs", deviceLogRouter);
deviceRouter.use("/:device/logs", deviceLogRouter);
deviceRouter.use("/errors", deviceErrorLogRouter);
deviceRouter.use("/:device/errors", deviceErrorLogRouter);

deviceRouter.route("/").get(deviceController.getAllDevices).post(deviceController.createDevice);

deviceRouter.get("/types", deviceController.getAllDeviceTypes);

deviceRouter
  .route("/:id")
  .get(deviceController.getOneDevice)
  .patch(
    restrictTo("Super Admin", "Admin"),
    helpers.omitFromBody(...nonManualUpdateKeys),
    deviceController.updateDevice
  )
  .delete(restrictTo("Super Admin"), deviceController.deleteDevice);

deviceRouter.post("/:id/check-out/student/:student_id", deviceController.checkOutDevice);
deviceRouter.post("/:id/check-in", deviceController.checkInDevice);
deviceRouter.post("/:id/assign", deviceController.assignDevice);
deviceRouter.post("/:id/unassign", deviceController.unassignDevice);

export default deviceRouter;
