"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateErrorLog = exports.createErrorLog = exports.getErrorLogsByDevice = exports.getErrorLog = exports.getAllErrorLogs = void 0;
const moment_1 = __importDefault(require("moment"));
const errorLogModel_1 = __importDefault(require("../../models/errorLogModel"));
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const factory = __importStar(require("./handlerFactory"));
const deviceModel_1 = __importDefault(require("../../models/deviceModel"));
exports.getAllErrorLogs = factory.getAll(errorLogModel_1.default);
exports.getErrorLog = factory.getOne(errorLogModel_1.default);
exports.getErrorLogsByDevice = factory.getAll(errorLogModel_1.default);
exports.createErrorLog = catchAsync_1.default(async (req, res, next) => {
    const now = moment_1.default();
    req.body.updates = undefined;
    req.body.final = false;
    req.body.checkInInfo = undefined;
    req.body.status = "Broken";
    const device = await deviceModel_1.default.findById(req.body.device);
    if (!device) {
        return next(new appError_1.default("No device found with that ID", 404));
    }
    if (device.status === "Checked Out") {
        return next(new appError_1.default(`Create an error when checking in ${device.deviceType}`, 400));
    }
    // If createdAt field is set
    if (req.body.createdAt)
        if (moment_1.default(req.body.createdAt).diff(now) > 0)
            // Check If createdAt is in the future
            return next(new appError_1.default("Date cannot be in the future", 400));
    device.status = "Broken";
    const errorLog = await errorLogModel_1.default.create(req.body);
    await device.save({ validateBeforeSave: false });
    res.status(201).json({
        status: "success",
        requestedAt: Date(),
        data: {
            errorLog,
        },
    });
});
exports.updateErrorLog = catchAsync_1.default(async (req, res, next) => {
    const errorLog = await errorLogModel_1.default.findById(req.params.id);
    if (!errorLog) {
        return next(new appError_1.default(`No ${req.device} found with that ID`, 404));
    }
    if (errorLog.final) {
        return next(new appError_1.default("This error has been finalized", 400));
    }
    const { description, status } = req.body;
    const update = { description, status };
    errorLog.updates.push(update);
    errorLog.status = status;
    if (status == "Fixed" || status == "Unfixable") {
        errorLog.final = true;
        const device = await deviceModel_1.default.findById(errorLog.device);
        if (device) {
            const unfinishedErrorsByDevice = await errorLogModel_1.default.find({
                device: device._id,
                final: false,
            });
            if (unfinishedErrorsByDevice.length === 1) {
                status == "Fixed" ? (device.status = "Available") : (device.status = "Not Available");
                await device.save({ validateBeforeSave: true });
            }
        }
    }
    await errorLog.save({ validateBeforeSave: true });
    res.status(200).json({
        status: "success",
        requestedAt: Date(),
        data: {
            errorLog,
        },
    });
});
