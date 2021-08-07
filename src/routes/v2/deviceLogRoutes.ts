import { Router } from "express";
import * as deviceLogController from "../../controllers/v2/deviceLogController";

const router = Router({ mergeParams: true });

router.get("/", deviceLogController.addDeviceToQuery, deviceLogController.getAllLogs);
router.get("/:_id", deviceLogController.getOneLog);

export default router;
