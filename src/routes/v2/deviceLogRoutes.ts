import { Router } from "express";
import * as deviceLogController from "../../controllers/v2/deviceLogController";
import * as helpers from "../../controllers/v2/helpers";

const router = Router({ mergeParams: true });

router.get("/", helpers.addKeyToQuery("device"), deviceLogController.getAllLogs);
router.get("/:_id", deviceLogController.getOneLog);

export default router;
