import { Schema, model } from "mongoose";
import { TextbookSetDocument } from "../types/models/textbookSetTypes";

const textbookSetSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    required: [true, "Which grade uses this textbook set?"],
  },
  slug: {
    type: String,
    // required: true,
  },
  numActiveBooks: {
    type: Number,
  },
});

textbookSetSchema.pre<TextbookSetDocument>("save", function (next) {
  console.log("HERE");
  if (this.isNew) this.numActiveBooks = 0;
  next();
});

const TextbookSet = model<TextbookSetDocument>("TextbookSet", textbookSetSchema);

export default TextbookSet;
