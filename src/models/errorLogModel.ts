import { model, Model, Schema, Types } from "mongoose";
import { ErrorLogDocument } from "../types/models/errorLogTypes";

const errorLogSchema: Schema<ErrorLogDocument, Model<ErrorLogDocument>> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Each error must have a title"],
      immutable: true,
    },
    device: {
      type: Types.ObjectId,
      ref: "Device",
      required: [true, "Each error must have a device."],
      immutable: true,
    },
    checkInInfo: {
      type: Types.ObjectId,
      ref: "DeviceLog",
      required: false,
      immutable: true,
    },
    description: {
      type: String,
      required: [true, "Please describe the device's error."],
      maxlength: 500,
      immutable: true,
    },
    updates: [
      {
        description: {
          type: String,
          maxlength: 500,
          required: [true, "Please describe the update to the device error"],
        },
        createdAt: {
          type: Date,
          default: () => Date.now(),
        },
        status: String,
      },
    ],
    final: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
      default: "Broken",
      enum: ["Broken", "In Repair", "Fixed", "Unfixable"],
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
      required: true,
      immutable: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

errorLogSchema.index({ device: 1 });

/** Error Log Model */
const ErrorLog = model<ErrorLogDocument>("ErrorLog", errorLogSchema);

export default ErrorLog;
