"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const deviceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Each Device must have a name"],
        unique: true,
    },
    brand: {
        type: String,
        required: [true, "Each Device has a brand"],
        unique: false,
    },
    model: {
        type: String,
        required: [true, "Each Device has a model"],
        unique: false,
    },
    serialNumber: {
        type: String,
        required: [true, "Each Device must have a serial number"],
        unique: false,
    },
    dueDate: {
        type: Date,
        required: false,
    },
    macAddress: {
        type: String,
        required: [true, "Each Device must have a MAC Address"],
    },
    status: {
        type: String,
        required: [true, "Each Device must have a status"],
        default: "Available",
        enum: {
            values: ["Available", "Checked Out", "Broken", "Not Available"],
            message: "Status is either: Available, Not Available, Broken, Not Available",
        },
    },
    deviceType: {
        type: String,
        required: [true, "Each Device must have a device type"],
    },
    autoUpdateExpiration: String,
    checkedOut: {
        type: Boolean,
        default: false,
    },
    lastUser: {
        type: mongoose_1.Types.ObjectId,
        ref: "Student",
    },
    teacherCheckOut: {
        type: mongoose_1.Types.ObjectId,
        ref: "Employee",
    },
    lastCheckOut: Date,
    lastCheckIn: Date,
    slug: String,
});
deviceSchema.pre("save", function (next) {
    this.slug = slugify_1.default(this.name, { lower: true });
    next();
});
const Device = mongoose_1.model("Device", deviceSchema);
exports.default = Device;
