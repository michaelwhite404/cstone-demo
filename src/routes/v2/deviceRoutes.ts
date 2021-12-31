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
deviceRouter.get("/from-google", deviceController.getDevicesFromGoogle);
deviceRouter.get("/from-google/:id", deviceController.getOneDeviceFromGoogle);

deviceRouter
  .route("/:id")
  .get(deviceController.getOneDevice)
  .patch(helpers.omitFromBody(...nonManualUpdateKeys), deviceController.updateDevice)
  .delete(deviceController.deleteDevice);

deviceRouter.post("/:id/check-out/student/:student_id", deviceController.checkOutDevice);
deviceRouter.post("/:id/check-in", deviceController.checkInDevice);

export default deviceRouter;
