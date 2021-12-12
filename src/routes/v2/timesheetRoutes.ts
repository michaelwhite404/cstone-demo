import { Router } from "express";
import { protect } from "../../controllers/v1/authController";
import {
  createTimeSheetEntry,
  deleteTimesheetEntry,
  getAllTimeSheetEntries,
  getOneTimeSheetEntry,
} from "../../controllers/v2/timesheetController";

const router = Router();

router.use(protect);

router.route("/").get(getAllTimeSheetEntries).post(createTimeSheetEntry);

router.route("/:id").get(getOneTimeSheetEntry).patch().delete(deleteTimesheetEntry);

export default router;
