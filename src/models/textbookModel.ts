import { Schema, model, Types, Model } from "mongoose";
import { TextbookDocument } from "../types/models/textbookTypes";
import AppError from "../utils/appError";
import TextbookSet from "./textbookSetModel";

const textbookSchema: Schema<TextbookDocument, Model<TextbookDocument>> = new Schema({
  textbookSet: {
    type: Types.ObjectId,
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
      values: ["Excellent", "Good", "Acceptable", "Poor"],
      message: "Quality must be: Excellent, Good, Acceptable, or Poor",
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
  checkedOut: {
    type: Boolean,
    default: false,
    required: true,
  },
  lastUser: {
    type: Types.ObjectId,
    ref: "Student",
  },
  teacherCheckOut: {
    type: Types.ObjectId,
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
    const set = await TextbookSet.findById(this.textbookSet);
    if (!set) return next(new AppError(`Foreign Key Constraint: textbookSet ID is not valid`, 400));
    this.$locals.wasNew = true;
    this.$locals.numActiveBooks = set.numActiveBooks;
  }
  next();
});

textbookSchema.post("save", async function () {
  if (this.$locals.wasNew === true) {
    const numActiveBooks = (this.$locals.numActiveBooks as number) + 1;
    await TextbookSet.findByIdAndUpdate(this.textbookSet, {
      numActiveBooks,
    });
  }
});

const Textbook = model("Textbook", textbookSchema);

export default Textbook;
