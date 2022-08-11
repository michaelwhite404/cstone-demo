import { LeaveDocument } from "@@types/models";
import { Model, model, Schema, Types } from "mongoose";

const leaveSchema: Schema<LeaveDocument, Model<LeaveDocument>> = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
    validate: {
      validator: function (): boolean {
        // @ts-ignore
        return this.dateStart < this.dateEnd;
      },
      message: "Start date must be before end date",
    },
  },
  reason: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  approval: {
    user: {
      type: Types.ObjectId,
      ref: "Employee",
      // required: true,
    },
    date: {
      type: Date,
    },
    approved: {
      type: Boolean,
      // required: true,
    },
  },
});

const Leave = model<LeaveDocument>("Leave", leaveSchema);

export default Leave;
