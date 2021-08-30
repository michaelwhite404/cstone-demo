"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const checkoutLogSchema = new mongoose_1.Schema({
    device: {
        type: mongoose_1.Types.ObjectId,
        ref: "Device",
    },
    checkOutDate: {
        type: Date,
        required: true,
        default: () => Date.now(),
    },
    checkInDate: {
        type: Date,
    },
    dueDate: {
        type: Date,
        required: false,
    },
    deviceUser: {
        type: mongoose_1.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    teacherCheckOut: {
        type: mongoose_1.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    teacherCheckIn: {
        type: mongoose_1.Types.ObjectId,
        ref: "Employee",
    },
    checkedIn: {
        type: Boolean,
        default: false,
    },
    error: {
        type: mongoose_1.Types.ObjectId,
        ref: "ErrorLog",
        required: false,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
checkoutLogSchema.index({ device: 1 });
const CheckoutLog = mongoose_1.model("DeviceLog", checkoutLogSchema);
exports.default = CheckoutLog;
