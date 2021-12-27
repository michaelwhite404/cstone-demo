import { Router } from "express";
import { getDeviceLogsPDF } from "../controllers/pdfController";
import { protect } from "../controllers/v2/authController";

const router = Router();

router.use(protect);
router.get("/device-logs", getDeviceLogsPDF);

export default router;
