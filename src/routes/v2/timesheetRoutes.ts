import { Router } from "express";
import { protect } from "../../controllers/v2/authController";
import {
  approveTimesheets,
  createTimeSheetEntry,
  deleteTimesheetEntry,
  getAllTimeSheetEntries,
  getOneTimeSheetEntry,
  updateTimesheetEntry,
} from "../../controllers/v2/timesheetController";

const router = Router();

router.use(protect);
// TODO: Restrict who can see what
router.route("/").get(getAllTimeSheetEntries).post(createTimeSheetEntry);

router.patch("/approve", approveTimesheets);

router
  .route("/:id")
  .get(getOneTimeSheetEntry)
  .patch(updateTimesheetEntry)
  .delete(deleteTimesheetEntry);

export default router;
