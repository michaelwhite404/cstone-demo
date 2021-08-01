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
exports.testStatusGroup = exports.checkInDevice = exports.checkOutDevice = exports.deleteDevice = exports.updateDevice = exports.createDevice = exports.getDevice = exports.getAllDevices = void 0;
const moment_1 = __importDefault(require("moment"));
const deviceModel_1 = __importDefault(require("../models/deviceModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const factory = __importStar(require("./handlerFactory"));
const checkoutLogModel_1 = __importDefault(require("../models/checkoutLogModel"));
const errorLogModel_1 = __importDefault(require("../models/errorLogModel"));
exports.getAllDevices = factory.getAll(deviceModel_1.default);
exports.getDevice = factory.getOne(deviceModel_1.default);
exports.createDevice = factory.createOne(deviceModel_1.default);
exports.updateDevice = factory.updateOne(deviceModel_1.default);
exports.deleteDevice = factory.deleteOne(deviceModel_1.default);
exports.checkOutDevice = catchAsync_1.default(async (req, res, next) => {
    const device = await deviceModel_1.default.findById(req.params.id);
    const now = moment_1.default();
    // If no Device
    if (!device) {
        return next(new appError_1.default(`No ${req.device} found with that ID`, 404));
    }
    // If Not Available
    if (device.status !== "Available") {
        return next(new appError_1.default(`This ${req.device} is ${device.status.toLowerCase()}`, 400));
    }
    let checkOutDate;
    device.checkedOut = true;
    req.body.lastCheckOut
        ? (device.lastCheckOut = req.body.lastCheckOut)
        : (device.lastCheckOut = now);
    device.lastUser = req.body.lastUser;
    device.teacherCheckOut = req.employee.id;
    device.status = "Checked Out";
    // If Check Out Date is set
    if (req.body.lastCheckOut) {
        // Check If Check Out Date is in the future
        if (moment_1.default(req.body.lastCheckOut).diff(now) > 0)
            return next(new appError_1.default("Check out date cannot be in the future", 400));
        checkOutDate = req.body.lastCheckOut;
        device.lastCheckOut = req.body.lastCheckOut;
    }
    // Else Check Out Date is Now
    else {
        checkOutDate = now;
        device.lastCheckOut = now;
    }
    // If Due Date Is Set
    if (req.body.dueDate) {
        // Check If Due Date is in the past
        if (moment_1.default(req.body.dueDate).diff(now) < 0) {
            return next(new appError_1.default("Due date cannot be in the past", 400));
        }
        device.dueDate = req.body.dueDate;
    }
    await device.save({ validateBeforeSave: false });
    await checkoutLogModel_1.default.create({
        device: device._id,
        checkOutDate,
        deviceUser: req.body.lastUser,
        teacherCheckOut: req.employee.id,
        checkedIn: false,
        dueDate: req.body.dueDate,
    });
    res.status(200).json({
        status: "success",
        data: {
            [req.device]: device,
        },
    });
});
exports.checkInDevice = catchAsync_1.default(async (req, res, next) => {
    const device = await deviceModel_1.default.findById(req.params.id);
    // If no Device
    if (!device) {
        return next(new appError_1.default(`No ${req.device} found with that ID`, 404));
    }
    // If Not Checked Out
    if (device.status !== "Checked Out") {
        return next(new appError_1.default(`This ${req.device} is ${device.status.toLowerCase()}`, 400));
    }
    if (req.body.checkInDate) {
        if (moment_1.default(req.body.checkInDate).diff(moment_1.default(device.lastCheckOut)) <= 0)
            return next(new appError_1.default(`A ${req.device} cannot be checked in before it was checked out`, 400));
        // Check If Check Out Date is in the future
        if (moment_1.default(req.body.checkInDate).diff(moment_1.default()) > 0)
            return next(new appError_1.default("Check in date cannot be in the future", 400));
    }
    device.checkedOut = false;
    device.lastCheckIn = req.body.checkInDate ? req.body.checkInDate : Date.now();
    device.teacherCheckOut = undefined;
    device.dueDate = undefined;
    const log = await checkoutLogModel_1.default.findOne({
        device: device._id,
        checkedIn: false,
    });
    log.checkInDate = req.body.checkInDate ? req.body.checkInDate : Date.now();
    (log.teacherCheckIn = req.employee.id), (log.checkedIn = true);
    if (req.body.error) {
        const { title, description } = req.body;
        const errorData = {
            title,
            description,
            device: device._id,
            checkInInfo: log._id,
            createdAt: req.body.checkInDate,
        };
        const errorLog = await errorLogModel_1.default.create(errorData);
        log.error = errorLog._id;
        device.status = "Broken";
    }
    else {
        device.status = "Available";
    }
    await device.save({ validateBeforeSave: false });
    await log.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "success",
        data: {
            [req.device]: device,
        },
    });
});
exports.testStatusGroup = catchAsync_1.default(async (req, res) => {
    const deviceType = req.device;
    const brands = await deviceModel_1.default.aggregate([
        {
            $match: { deviceType },
        },
        {
            $group: {
                _id: {
                    brand: "$brand",
                    status: "$status",
                    model: "$model",
                },
                count: { $sum: 1 },
            },
        },
        {
            $group: {
                _id: {
                    brand: "$_id.brand",
                    model: "$_id.model",
                },
                statuses: {
                    $push: {
                        status: "$_id.status",
                        count: "$count",
                    },
                },
                count: { $sum: "$count" },
            },
        },
        {
            $group: {
                _id: "$_id.brand",
                models: {
                    $push: {
                        model: "$_id.model",
                        count: "$count",
                        statuses: "$statuses",
                    },
                },
                count: { $sum: "$count" },
            },
        },
        {
            $project: {
                brand: "$_id",
                count: 1,
                models: 1,
                _id: 0,
            },
        },
        {
            $sort: { brand: 1 },
        },
    ]);
    const statuses = await deviceModel_1.default.aggregate([
        {
            $match: { deviceType },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                status: "$_id",
                count: 1,
                _id: 0,
            },
        },
    ]);
    const totals = {};
    const totalCount = await deviceModel_1.default.countDocuments({ deviceType });
    totals.count = totalCount;
    totals.statuses = statuses;
    res.status(200).json({
        status: "success",
        requestedAt: Date(),
        data: {
            brands,
            totals,
        },
    });
});
