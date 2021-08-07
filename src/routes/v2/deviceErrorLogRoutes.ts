import { Router } from "express";
import * as helpers from "../../controllers/v2/helpers";
import * as deviceErrorLogController from "../../controllers/v2/deviceErrorLogController";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(helpers.addDeviceToQuery, deviceErrorLogController.getAllDeviceErrorLogs)
  .post(deviceErrorLogController.setCreateData, deviceErrorLogController.createErrorLog);

router
  .route("/:_id")
  .get(deviceErrorLogController.getDeviceErrorLog)
  .patch(deviceErrorLogController.updateErrorLog);

export default router;
