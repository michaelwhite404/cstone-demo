import { model, Schema, Types } from "mongoose";
import { AftercareAttendanceEntryDocument } from "@@types/models";

const aftercareAttendanceEntrySchema = new Schema({
  student: {
    type: Types.ObjectId,
    ref: "Student",
    required: [true, "Each aftercare attendance entry must have a student."],
    immutable: true,
  },
  attended: {
    type: Boolean,
    required: true,
  },
  session: {
    type: Types.ObjectId,
    ref: "AftercareSession",
    required: [true, "Each aftercare attendance entry must have a session."],
    immutable: true,
  },
  signOutDate: Date,
  signature: String,
  lateSignOut: Boolean,
  dropIn: Boolean,
});

const AftercareAttendanceEntry = model<AftercareAttendanceEntryDocument>(
  "AftercareAttendanceEntry",
  aftercareAttendanceEntrySchema
);

export default AftercareAttendanceEntry;
