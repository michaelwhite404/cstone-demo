"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const timesheetEntrySchema = new mongoose_1.Schema({
    employeeId: {
        type: mongoose_1.Types.ObjectId,
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
        type: mongoose_1.Types.ObjectId,
        ref: "Employee",
    },
});
const TimesheetEntry = mongoose_1.model("TimesheetEntry", timesheetEntrySchema);
exports.default = TimesheetEntry;
