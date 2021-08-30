"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../utils/appError"));
const textbookSetModel_1 = __importDefault(require("./textbookSetModel"));
const textbookSchema = new mongoose_1.Schema({
    textbookSet: {
        type: mongoose_1.Types.ObjectId,
        ref: "TextbookSet",
        required: [true, "Each textbook must have a textbookSet"],
        immutable: true,
    },
    bookNumber: {
        type: Number,
        required: [true, "Each textbook must have a number"],
    },
    quality: {
        type: String,
        required: [true, "Each textbook must have a quality"],
        default: "Excellent",
        enum: {
            values: ["Excellent", "Good", "Acceptable", "Poor", "Lost"],
            message: "Quality must be: Excellent, Good, Acceptable, Poor or Lost",
        },
    },
    status: {
        type: String,
        required: [true, "Each textbook must have a status"],
        default: "Available",
        enum: {
            values: ["Available", "Checked Out", "Replaced", "Not Available"],
            message: "Status must be: Available, Checked Out, Replaced, or Not Available",
        },
    },
    lastUser: {
        type: mongoose_1.Types.ObjectId,
        ref: "Student",
    },
    teacherCheckOut: {
        type: mongoose_1.Types.ObjectId,
        ref: "Employee",
    },
    active: {
        type: Boolean,
        default: true,
        required: true,
    },
});
textbookSchema.index({ textbookSet: 1, bookNumber: 1 }, { unique: true });
textbookSchema.pre("save", async function (next) {
    if (this.isNew) {
        const set = await textbookSetModel_1.default.findById(this.textbookSet);
        if (!set)
            return next(new appError_1.default(`Foreign Key Constraint: textbookSet ID is not valid`, 400));
        this.$locals.wasNew = true;
        this.$locals.numActiveBooks = set.numActiveBooks;
    }
    next();
});
textbookSchema.post("save", async function () {
    if (this.$locals.wasNew === true) {
        const numActiveBooks = this.$locals.numActiveBooks + 1;
        await textbookSetModel_1.default.findByIdAndUpdate(this.textbookSet, {
            numActiveBooks,
        });
    }
});
const Textbook = mongoose_1.model("Textbook", textbookSchema);
exports.default = Textbook;
