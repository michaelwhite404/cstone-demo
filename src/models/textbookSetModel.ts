import { Schema, model, Model } from "mongoose";
import { TextbookSetDocument } from "../types/models/textbookSetTypes";

const textbookSetSchema: Schema<TextbookSetDocument, Model<TextbookSetDocument>> = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
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
  if (this.isNew) this.numActiveBooks = 0;
  next();
});

const TextbookSet = model("TextbookSet", textbookSetSchema);

export default TextbookSet;
