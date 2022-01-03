import { Router } from "express";
import { restrictTo } from "../../controllers/v1/authController";
import * as v2auth from "../../controllers/v2/authController";
import { getAllOrgUnits } from "../../controllers/v2/orgUnitController";

const router = Router();

router.use(v2auth.protect);

router.get("/", restrictTo("Super Admin"), getAllOrgUnits);

export default router;
