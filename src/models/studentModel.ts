import { model, Schema } from "mongoose";
import slugify from "slugify";
import { StudentDocument } from "../types/models/studentTypes";

const studentSchema = new Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentSchema.virtual("textbooksCheckedOut", {
  ref: "Textbook",
  foreignField: "lastUser",
  localField: "_id",
  match: { status: "Checked Out" },
});

studentSchema.pre<StudentDocument>("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  this.slug = slugify(this.fullName, { lower: true });
  next();
});

/** Student Model */
const Student = model<StudentDocument>("Student", studentSchema);

export default Student;
