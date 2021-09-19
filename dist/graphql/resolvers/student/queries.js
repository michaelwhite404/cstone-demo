"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studentModel_1 = __importDefault(require("../../../models/studentModel"));
const apiFeatures_1 = __importDefault(require("../../../utils/apiFeatures"));
const studentQueries = {
    students: async (_, args) => {
        if (!args.sort)
            args.sort = "grade,lastName";
        const { filter = {}, ...rest } = args;
        const newArgs = Object.assign(filter, rest);
        const pqs = { ...newArgs };
        const query = studentModel_1.default.find();
        const features = new apiFeatures_1.default(query, pqs).filter().limitFields().sort().paginate();
        const students = await features.query;
        return students;
    },
    student: async (_, args) => {
        if (!mongoose_1.isValidObjectId(args.id))
            return null;
        const student = await studentModel_1.default.findById(args.id);
        return student;
    },
};
exports.default = studentQueries;
