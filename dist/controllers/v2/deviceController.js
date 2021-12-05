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
exports.getDevicesFromGoogle = exports.getAllDeviceTypes = exports.checkInDevice = exports.checkOutDevice = exports.deleteDevice = exports.updateDevice = exports.createDevice = exports.getOneDevice = exports.getAllDevices = void 0;
const googleapis_1 = require("googleapis");
const mongoose_1 = require("mongoose");
const checkoutLogModel_1 = __importDefault(require("../../models/checkoutLogModel"));
const deviceModel_1 = __importDefault(require("../../models/deviceModel"));
const errorLogModel_1 = __importDefault(require("../../models/errorLogModel"));
const studentModel_1 = __importDefault(require("../../models/studentModel"));
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const factory = __importStar(require("./handlerFactory"));
const Model = deviceModel_1.default;
const key = "device";
const pop = { path: "lastUser teacherCheckOut", select: "fullName grade email" };
/** `GET` - Gets all devices
 *  - All authorized users can access this route
 */
exports.getAllDevices = factory.getAll(Model, `${key}s`, {}, pop);
/** `GET` - Gets a single device
 *  - All authorized users can access this route
 */
exports.getOneDevice = factory.getOneById(Model, key, pop);
/** `POST` - Creates a new device
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
exports.createDevice = catchAsync_1.default(async (req, res) => {
    const device = await deviceModel_1.default.create({
        name: req.body.name,
        brand: req.body.brand,
        model: req.body.model,
        serialNumber: req.body.serialNumber,
        macAddress: req.body.macAddress,
        deviceType: req.body.deviceType,
    });
    res.status(201).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            device,
        },
    });
});
/** `PATCH` - Updates a device
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
exports.updateDevice = factory.updateOne(Model, key);
/** `DELETE` - Deletes a device
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
exports.deleteDevice = factory.deleteOne(Model, "Device");
exports.checkOutDevice = catchAsync_1.default(async (req, res, next) => {
    const [device, student] = await Promise.all([
        deviceModel_1.default.findById(req.params.id),
        studentModel_1.default.findById(req.params.student_id),
    ]);
    // If no device
    if (!device)
        return next(new appError_1.default("No device found with that ID", 404));
    // If Not Available
    if (device.status !== "Available")
        return next(new appError_1.default(`This device is ${device.status.toLowerCase()}`, 400));
    // No student
    if (!student)
        return next(new appError_1.default("No student found with that ID", 404));
    // Device can be checked out
    device.checkedOut = true;
    device.status = "Checked Out";
    device.lastCheckOut = new Date(req.requestTime);
    device.lastUser = new mongoose_1.Types.ObjectId(req.params.student_id);
    device.teacherCheckOut = new mongoose_1.Types.ObjectId(req.employee._id);
    device.dueDate = req.body.dueDate;
    // Save device
    await device.save({ validateBeforeSave: true });
    // Create checkout log
    await checkoutLogModel_1.default.create({
        device: device._id,
        checkOutDate: req.requestTime,
        deviceUser: device.lastUser,
        teacherCheckOut: req.employee._id,
        checkedIn: false,
        dueDate: device.dueDate,
    });
    await deviceModel_1.default.populate(device, pop);
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            device,
        },
    });
});
exports.checkInDevice = catchAsync_1.default(async (req, res, next) => {
    const device = await deviceModel_1.default.findById(req.params.id);
    // If no Device
    if (!device) {
        return next(new appError_1.default("No device found with that ID", 404));
    }
    // If Not Checked Out
    if (device.status !== "Checked Out") {
        return next(new appError_1.default(`This device is ${device.status.toLowerCase()}`, 400));
    }
    device.checkedOut = false;
    device.lastCheckIn = new Date(req.requestTime);
    device.teacherCheckOut = undefined;
    device.dueDate = undefined;
    const log = await checkoutLogModel_1.default.findOne({
        device: device._id,
        checkedIn: false,
    });
    // If error
    if (log) {
        log.checkInDate = new Date(req.requestTime);
        log.teacherCheckIn = req.employee._id;
        log.checkedIn = true;
        if (req.body.error === true || req.body.error === "true") {
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
    }
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            device,
        },
    });
});
exports.getAllDeviceTypes = catchAsync_1.default(async (req, res) => {
    const result = await deviceModel_1.default.aggregate([{ $group: { _id: "$deviceType" } }]);
    const types = result.map((r) => r._id);
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        types,
    });
});
exports.getDevicesFromGoogle = catchAsync_1.default(async (req, res) => {
    var _a;
    const scopes = ["https://www.googleapis.com/auth/admin.directory.device.chromeos"];
    const authEmail = req.employee.email;
    const auth = new googleapis_1.google.auth.JWT(process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL, undefined, (_a = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"), scopes, authEmail);
    const admin = googleapis_1.google.admin({
        version: "directory_v1",
        auth,
    });
    const result = await admin.chromeosdevices.list({
        customerId: process.env.GOOGLE_CUSTOMER_ID,
    });
    const devices = result.data.chromeosdevices;
    res.status(200).json({
        devices,
    });
});
