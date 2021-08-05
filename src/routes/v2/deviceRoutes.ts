import { Router } from "express";
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

deviceRouter.route("/").get(deviceController.getAllDevices).post(deviceController.createDevice);
deviceRouter
  .route("/:id")
  .get(deviceController.getOneDevice)
  .patch(helpers.omitFromBody(...nonManualUpdateKeys), deviceController.updateDevice)
  .delete(deviceController.deleteDevice);

export default deviceRouter;
