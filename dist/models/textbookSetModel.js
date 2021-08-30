"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const textbookSetSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Each textbook set must have a title"],
        unique: [true, "Each textbook set must have its own title"],
        trim: true,
    },
    class: {
        type: String,
        required: true,
        trim: true,
    },
    grade: {
        type: Number,
        required: [true, "Which grade uses this textbook set?"],
        min: 0,
        max: 12,
    },
    slug: {
        type: String,
        unique: true,
        // required: true,
    },
    numActiveBooks: {
        type: Number,
        // default: 0,
    },
});
textbookSetSchema.pre("save", function (next) {
    if (this.isNew)
        this.numActiveBooks = 0;
    this.slug = slugify_1.default(this.title, { lower: true });
    next();
});
const TextbookSet = mongoose_1.model("TextbookSet", textbookSetSchema);
exports.default = TextbookSet;
