import { Router } from "express";
import { protect } from "../../controllers/v2/authController";
import {
  approveTimesheets,
  createTimeSheetEntry,
  deleteTimesheetEntry,
  getAllTimeSheetEntries,
  getOneTimesheetEntry,
  updateTimesheetEntry,
} from "../../controllers/v2/timesheetController";

const router = Router();

router.use(protect);

router.route("/").get(getAllTimeSheetEntries).post(createTimeSheetEntry);

router.patch("/approve", approveTimesheets);

router
  .route("/:id")
  .get(getOneTimesheetEntry)
  .patch(updateTimesheetEntry)
  .delete(deleteTimesheetEntry);

export default router;
