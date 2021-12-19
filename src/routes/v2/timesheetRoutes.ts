import { Router } from "express";
import { protect } from "../../controllers/v2/authController";
import {
  createTimeSheetEntry,
  deleteTimesheetEntry,
  getAllTimeSheetEntries,
  getOneTimeSheetEntry,
  updateTimesheetEntry,
} from "../../controllers/v2/timesheetController";

const router = Router();

router.use(protect);

router.route("/").get(getAllTimeSheetEntries).post(createTimeSheetEntry);

router
  .route("/:id")
  .get(getOneTimeSheetEntry)
  .patch(updateTimesheetEntry)
  .delete(deleteTimesheetEntry);

export default router;
