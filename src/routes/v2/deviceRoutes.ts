import { Router } from "express";
import deviceLogRouter from "./deviceLogRoutes";
import deviceErrorLogRouter from "./deviceErrorLogRoutes";
import * as deviceController from "../../controllers/v2/deviceController";
import * as v1auth from "../../controllers/v1/authController";
import * as helpers from "../../controllers/v2/helpers";

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
deviceRouter.use(v1auth.protect);

deviceRouter.use("/logs", deviceLogRouter);
deviceRouter.use("/:device/logs", deviceLogRouter);
deviceRouter.use("/errors", deviceErrorLogRouter);
deviceRouter.use("/:device/errors", deviceErrorLogRouter);

deviceRouter.route("/").get(deviceController.getAllDevices).post(deviceController.createDevice);

deviceRouter.get("/types", deviceController.getAllDeviceTypes);

deviceRouter.get(
  "/from-google",
  v1auth.restrictTo("Super Admin", "Admin"),
  deviceController.getDevicesFromGoogle
);
deviceRouter.get(
  "/from-google/:id",
  v1auth.restrictTo("Super Admin", "Admin"),
  deviceController.getOneDeviceFromGoogle
);
deviceRouter.post(
  "/from-google/:id/:reset(wipe|powerwash)",
  v1auth.restrictTo("Super Admin"),
  deviceController.resetDeviceFromGoogle
);
deviceRouter.post(
  "/from-google/:id/move",
  v1auth.restrictTo("Super Admin"),
  deviceController.moveDeviceToOu
);
deviceRouter.post(
  "/from-google/:id/:action(disable|reenable|deprovision)",
  v1auth.restrictTo("Super Admin"),
  deviceController.deviceAction
);

deviceRouter
  .route("/:id")
  .get(deviceController.getOneDevice)
  .patch(
    v1auth.restrictTo("Super Admin", "Admin"),
    helpers.omitFromBody(...nonManualUpdateKeys),
    deviceController.updateDevice
  )
  .delete(v1auth.restrictTo("Super Admin"), deviceController.deleteDevice);

deviceRouter.post("/:id/check-out/student/:student_id", deviceController.checkOutDevice);
deviceRouter.post("/:id/check-in", deviceController.checkInDevice);
deviceRouter.post("/:id/assign", deviceController.assignDevice);
deviceRouter.post("/:id/unassign", deviceController.unassignDevice);

export default deviceRouter;
