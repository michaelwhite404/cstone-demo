import { model, Schema, Types } from "mongoose";

const timesheetEntrySchema = new Schema({
  employeeId: {
    type: Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  timeStart: {
    type: Date,
    required: true,
  },
  timeEnd: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  hours: Number,
  approved: Boolean,
  approvedBy: {
    type: Types.ObjectId,
    ref: "Employee",
  },
});

const TimesheetEntry = model("TimesheetEntry", timesheetEntrySchema);

export default TimesheetEntry;
