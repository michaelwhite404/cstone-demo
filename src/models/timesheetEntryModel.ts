import {
  Model,
  model,
  ObjectId,
  Schema,
  SchemaDefinition,
  SchemaTypeOptions,
  Types,
  ValidateFn,
} from "mongoose";
import { TimesheetEntryDocument } from "../types/models/timesheetEntryTypes";
import AppError from "../utils/appError";
import datesAreOnSameDay from "../utils/datesAreOnSameDay";

const timesheetEntrySchema: Schema<
  TimesheetEntryDocument,
  Model<TimesheetEntryDocument>
> = new Schema({
  employeeId: {
    type: Types.ObjectId,
    ref: "Employee",
    required: [true, "Each timesheet entry must have an employee id"],
    immutable: true,
  } as SchemaTypeOptions<ObjectId>,
  timeStart: {
    type: Date,
    required: [true, "Each timesheet entry must have a start time"],
    validate: {
      validator: function (timeStart) {
        // @ts-ignore
        const timeEnd: Date = this.timeEnd;
        return timeStart.getTime() < timeEnd.getTime();
      } as ValidateFn<Date>,
      message: "Start time must be before end time",
    },
  } as SchemaTypeOptions<Date>,
  timeEnd: {
    type: Date,
    required: [true, "Each timesheet entry must have a end time"],
  },
  description: {
    type: String,
    required: [true, "Each timesheet entry must have a description"],
  } as SchemaTypeOptions<string>,
  hours: Number,
  approved: {
    type: Boolean,
    default: false,
  },
  approvedBy: {
    type: Types.ObjectId,
    ref: "Employee",
  },
} as SchemaDefinition);

timesheetEntrySchema.pre<TimesheetEntryDocument>("save", function (next) {
  if (new Date(this.timeStart) >= new Date(this.timeEnd))
    return next(new AppError("Start time must be before end time", 400));

  if (!datesAreOnSameDay(this.timeStart, this.timeEnd))
    return next(new AppError("Start and end times must be on the same day", 400));

  this.hours = (this.timeEnd.getTime() - this.timeStart.getTime()) / 60 / 60 / 1000;
  next();
});

const TimesheetEntry = model<TimesheetEntryDocument>("TimesheetEntry", timesheetEntrySchema);

export default TimesheetEntry;
