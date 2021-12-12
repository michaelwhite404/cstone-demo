"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../utils/appError"));
const datesAreOnSameDay_1 = __importDefault(require("../utils/datesAreOnSameDay"));
const timesheetEntrySchema = new mongoose_1.Schema({
    employeeId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Employee",
        required: [true, "Each timesheet entry must have an employee id"],
    },
    timeStart: {
        type: Date,
        required: [true, "Each timesheet entry must have a start time"],
    },
    timeEnd: {
        type: Date,
        required: [true, "Each timesheet entry must have a end time"],
    },
    description: {
        type: String,
        required: [true, "Each timesheet entry must have a description"],
    },
    hours: Number,
    approved: {
        type: Boolean,
        default: false,
    },
    approvedBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "Employee",
    },
});
timesheetEntrySchema.pre("save", function (next) {
    if (new Date(this.timeStart) >= new Date(this.timeEnd))
        return next(new appError_1.default("Start time must be before end time", 400));
    if (!datesAreOnSameDay_1.default(this.timeStart, this.timeEnd))
        return next(new appError_1.default("Start and end times must be on the same day", 400));
    this.hours = (this.timeEnd.getTime() - this.timeStart.getTime()) / 60 / 60 / 1000;
    next();
});
const TimesheetEntry = mongoose_1.model("TimesheetEntry", timesheetEntrySchema);
exports.default = TimesheetEntry;
