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
exports.groupSudentsByGrade = exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getOneStudent = exports.getAllStudents = void 0;
const studentModel_1 = __importDefault(require("../../models/studentModel"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const factory = __importStar(require("./handlerFactory"));
const Model = studentModel_1.default;
const key = "student";
/** `GET` - Gets all students */
exports.getAllStudents = factory.getAll(studentModel_1.default, `${key}s`);
/** `GET` - Gets a single student */
exports.getOneStudent = factory.getOneById(Model, key, {
    path: "textbooksCheckedOut",
    select: "textbookSet quality bookNumber teacherCheckOut -lastUser",
    populate: {
        path: "teacherCheckOut",
        select: "fullName -_id ",
    },
});
/** `POST` - Creates a single student */
exports.createStudent = factory.createOne(Model, key);
/** `PATCH` - Updates a single student */
exports.updateStudent = factory.updateOne(Model, key);
/** `DELETE` - Deletes student */
exports.deleteStudent = factory.deleteOne(Model, "Student");
exports.groupSudentsByGrade = catchAsync_1.default(async (_, res) => {
    const grades = await studentModel_1.default.aggregate([
        { $match: { status: "Active" } },
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
