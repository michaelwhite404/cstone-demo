"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const textbookLogSchema = new mongoose_1.Schema({
    textbook: {
        type: mongoose_1.Types.ObjectId,
        ref: "Textbook",
        required: true,
    },
    checkedIn: {
        type: Boolean,
        required: true,
    },
    student: {
        type: mongoose_1.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    teacherCheckOut: {
        type: mongoose_1.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    qualityOut: {
        type: String,
        enum: {
            values: ["Excellent", "Good", "Acceptable", "Poor"],
            message: "Quality must be: Excellent, Good, Acceptable, or Poor",
        },
        required: true,
    },
    checkInDate: Date,
    teacherCheckIn: {
        type: mongoose_1.Types.ObjectId,
        ref: "Employee",
    },
    qualityIn: {
        type: String,
        enum: {
            values: ["Excellent", "Good", "Acceptable", "Poor"],
            message: "Quality must be: Excellent, Good, Acceptable, or Poor",
        },
    },
});
const TextbookLog = mongoose_1.model("TextbookLog", textbookLogSchema);
exports.default = TextbookLog;
