import { Schema, model, Types } from "mongoose";
import { TextbookDocument } from "../types/models/textbookTypes";

const textbookSchema = new Schema({
  setId: {
    type: Types.ObjectId,
    ref: "TextbookSet",
    required: true,
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

const Textbook = model<TextbookDocument>("Textbook", textbookSchema);

export default Textbook;
