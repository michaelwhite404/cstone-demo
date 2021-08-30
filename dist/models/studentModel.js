"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const studentSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "An employee must have a first name"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "An employee must have a last name"],
        trim: true,
    },
    fullName: {
        type: String,
        trim: true,
    },
    grade: {
        type: Number,
        required: false,
        min: 0,
        max: 12,
    },
    schoolEmail: {
        type: String,
        required: true,
    },
    personalEmail: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive", "Graduate"],
    },
    customID: {
        type: String,
        required: false,
    },
    mainPhoto: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    lastUpdate: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    slug: String,
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
studentSchema.virtual("textbooksCheckedOut", {
    ref: "Textbook",
    foreignField: "lastUser",
    localField: "_id",
    match: { status: "Checked Out" },
});
studentSchema.pre("save", function (next) {
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.slug = slugify_1.default(this.fullName, { lower: true });
    next();
});
/** Student Model */
const Student = mongoose_1.model("Student", studentSchema);
exports.default = Student;
