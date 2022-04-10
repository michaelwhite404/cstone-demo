import { AftercareSessionDocument } from "@@types/models";
import { model, Schema } from "mongoose";

const aftercareSessionSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: () => new Date().toISOString(),
  },
  active: {
    type: Boolean,
    required: true,
  },
  numAttended: {
    type: Number,
    required: true,
  },
  dropIns: {
    type: Number,
    required: true,
  },
});

// aftercareSessionSchema.virtual("numAttended", {
//   ref: "AftercareAttendanceEntry",
//   foreignField: "session",
//   localField: "_id",
//   match: {attended: true},
//   count: true,
// });

// aftercareSessionSchema.virtual("dropIns", {
//   ref: "AftercareAttendanceEntry",
//   foreignField: "session",
//   localField: "_id",
//   match: { attended: true },
//   count: true,
// });

const AftercareSession = model<AftercareSessionDocument>(
  "AftercareSession",
  aftercareSessionSchema
);

export default AftercareSession;
