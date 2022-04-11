import { AftercareSessionDocument, AftercareSessionModel } from "@@types/models";
import { Model, model, Schema } from "mongoose";

interface ASM extends Model<AftercareSessionModel> {
  /** Finds today's session, if it exists */
  sessionToday(): Promise<AftercareSessionDocument | undefined>;
}

const aftercareSessionSchema = new Schema<AftercareSessionModel, ASM>({
  date: {
    type: Date,
    required: true,
    default: () => new Date().toISOString(),
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  numAttended: {
    type: Number,
    required: true,
    min: 0,
  },
  dropIns: {
    type: Number,
    required: true,
    min: 0,
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

aftercareSessionSchema.static("sessionToday", async function (this) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return await this.findOne({ date: { $gte: start, $lt: end } });
});

const AftercareSession = model<AftercareSessionModel, ASM>(
  "AftercareSession",
  aftercareSessionSchema
);

export default AftercareSession;
