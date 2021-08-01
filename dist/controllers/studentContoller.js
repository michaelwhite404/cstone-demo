"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupTest = exports.updateStudent = exports.createStudent = exports.getStudent = exports.getAllStudents = void 0;
const slugify_1 = __importDefault(require("slugify"));
const studentModel_1 = __importDefault(require("../models/studentModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
exports.getAllStudents = catchAsync_1.default(async (req, res) => {
    const features = new apiFeatures_1.default(studentModel_1.default.find(), req.query).filter().limitFields().paginate();
    const students = await features.query;
    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        results: students.length,
        data: {
            students,
        },
    });
});
exports.getStudent = catchAsync_1.default(async (req, res, next) => {
    const student = await studentModel_1.default.findById(req.params.id);
    if (!student) {
        return next(new appError_1.default("No student found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        requestedAt: Date(),
        data: {
            student,
        },
    });
});
exports.createStudent = catchAsync_1.default(async (req, res) => {
    const newStudent = await studentModel_1.default.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            student: newStudent,
        },
    });
});
// Update Student (PATCH)
exports.updateStudent = catchAsync_1.default(async (req, res, next) => {
    req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
    const student = await studentModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!student) {
        return next(new appError_1.default("No student found with that ID", 404));
    }
    student.fullName = `${student.firstName} ${student.lastName}`;
    student.slug = slugify_1.default(`${student.fullName}`, { lower: true });
    await student.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "success",
        data: {
            student,
        },
    });
});
exports.groupTest = catchAsync_1.default(async (_, res) => {
    const grades = await studentModel_1.default.aggregate([
        {
            $sort: { lastName: 1 },
        },
        {
            $group: {
                _id: "$grade",
                count: { $sum: 1 },
                students: { $push: { id: "$_id", fullName: "$fullName" } },
            },
        },
        {
            $project: {
                grade: "$_id",
                students: 1,
                count: 1,
                _id: 0,
            },
        },
        {
            $sort: { grade: 1 },
        },
    ]);
    res.status(200).json({
        status: "success",
        data: {
            grades,
        },
    });
});
