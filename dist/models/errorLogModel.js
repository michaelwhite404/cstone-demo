"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../utils/appError"));
const deviceModel_1 = __importDefault(require("./deviceModel"));
const errorLogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Each error must have a title"],
        immutable: true,
    },
    device: {
        type: mongoose_1.Types.ObjectId,
        ref: "Device",
        required: [true, "Each error must have a device."],
        immutable: true,
    },
    checkInInfo: {
        type: mongoose_1.Types.ObjectId,
        ref: "DeviceLog",
        required: false,
        immutable: true,
    },
    description: {
        type: String,
        required: [true, "Please describe the device's error."],
        maxlength: 500,
        immutable: true,
    },
    updates: [
        {
            description: {
                type: String,
                maxlength: 500,
                required: [true, "Please describe the update to the device error"],
            },
            createdAt: {
                type: Date,
                default: () => Date.now(),
            },
            status: String,
        },
    ],
    final: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        required: true,
        default: "Broken",
        enum: ["Broken", "In Repair", "Fixed", "Unfixable"],
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        required: true,
        immutable: true,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
errorLogSchema.index({ device: 1 });
errorLogSchema.pre("save", async function (next) {
    if (this.isNew) {
        const device = await deviceModel_1.default.findById(this.device);
        if (!device) {
            return next(new appError_1.default("No device found with that ID", 404));
        }
        // if (device.status === "Checked Out") {
        //   return next(new AppError(`Create an error when checking in ${device.deviceType}`, 400));
        // }
        device.status = "Broken";
        this.$locals.wasNew = this.isNew;
    }
});
errorLogSchema.post("save", async function () {
    if (this.$locals.wasNew)
        await deviceModel_1.default.findByIdAndUpdate(this.device, { status: "Broken" });
});
/** Error Log Model */
const ErrorLog = mongoose_1.model("ErrorLog", errorLogSchema);
exports.default = ErrorLog;
