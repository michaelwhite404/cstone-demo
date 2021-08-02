import { Router } from "express";
import v1Router from "./v1Routes";

const router = Router();

router.use("/v1", v1Router);

// router.use(["/v2", "/"])

export default router;
