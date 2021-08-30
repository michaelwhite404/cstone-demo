"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.updateMe = exports.getEmployee = exports.getAllEmployees = void 0;
const slugify_1 = __importDefault(require("slugify"));
const employeeModel_1 = __importDefault(require("../../models/employeeModel"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
exports.getAllEmployees = catchAsync_1.default(async (_, res) => {
    const employees = await employeeModel_1.default.find();
    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        requestedAt: Date(),
        results: employees.length,
        data: {
            employees,
        },
    });
});
exports.getEmployee = catchAsync_1.default(async (req, res, next) => {
    const employee = await employeeModel_1.default.findById(req.params.id);
    if (!employee) {
        return next(new appError_1.default("No user found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        requestedAt: Date(),
        data: {
            employee,
        },
    });
});
// TODO: Finish Method
exports.updateMe = catchAsync_1.default(async (req, _, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError_1.default("This route is not for password updates. Please use /update-password.", 400));
    }
});
exports.updateUser = catchAsync_1.default(async (req, res, next) => {
    const employee = await employeeModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!employee) {
        return next(new appError_1.default("No user found with that ID", 404));
    }
    employee.fullName = `${employee.firstName} ${employee.lastName}`;
    employee.slug = slugify_1.default(`${employee.fullName}`, { lower: true });
    await employee.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "success",
        requestedAt: Date(),
        data: {
            employee,
        },
    });
});
