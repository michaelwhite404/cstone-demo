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
exports.updateErrorLog = exports.createErrorLog = exports.getDeviceErrorLog = exports.getAllDeviceErrorLogs = exports.setCreateData = void 0;
const deviceModel_1 = __importDefault(require("../../models/deviceModel"));
const errorLogModel_1 = __importDefault(require("../../models/errorLogModel"));
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const factory = __importStar(require("./handlerFactory"));
const Model = errorLogModel_1.default;
const key = "errorLog";
const setCreateData = (req, _, next) => {
    req.body.updates = undefined;
    req.body.final = false;
    req.body.checkInInfo = undefined;
    req.body.status = "Broken";
    if (req.params.device)
        req.body.device = req.params.device;
    next();
};
exports.setCreateData = setCreateData;
exports.getAllDeviceErrorLogs = factory.getAll(Model, `${key}s`);
exports.getDeviceErrorLog = factory.getOne(Model, key);
exports.createErrorLog = factory.createOne(Model, key);
exports.updateErrorLog = catchAsync_1.default(async (req, res, next) => {
    console.log(req.params);
    const errorLog = await errorLogModel_1.default.findOne(req.params);
    if (!errorLog)
        return next(new appError_1.default("No error log found with that ID", 404));
    if (errorLog.final)
        return next(new appError_1.default("This error has been finalized", 400));
    const { status, description } = req.body;
    errorLog.updates.push({
        description,
        status,
        createdAt: new Date(req.requestTime),
    });
    errorLog.status = req.body.status;
    let saved = false;
    // If error will be finalized
    if (status === "Fixed" || status === "Unfixable") {
        errorLog.final = true;
        const device = await deviceModel_1.default.findById(errorLog.device);
        if (device) {
            const unfinishedErrorsByDevice = await errorLogModel_1.default.find({
                device: device._id,
                final: false,
            });
            if (unfinishedErrorsByDevice.length === 1) {
                status === "Fixed" ? (device.status = "Available") : (device.status = "Not Available");
                await errorLog.save({ validateBeforeSave: true });
                saved = true;
                await device.save({ validateBeforeSave: true });
            }
        }
    }
    saved === false && (await errorLog.save({ validateBeforeSave: true }));
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            errorLog,
        },
    });
});
