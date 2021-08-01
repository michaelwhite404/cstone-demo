import { model, Schema, Types } from "mongoose";

const checkoutLogSchema = new Schema(
  {
    device: {
      type: Types.ObjectId,
      ref: "Device",
    },
    checkOutDate: {
      type: Date,
      required: true,
      default: () => Date.now(),
    },
    checkInDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    deviceUser: {
      type: Types.ObjectId,
      ref: "Student",
      required: true,
    },
    teacherCheckOut: {
      type: Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    teacherCheckIn: {
      type: Types.ObjectId,
      ref: "Employee",
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Types.ObjectId,
      ref: "ErrorLog",
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

checkoutLogSchema.index({ device: 1 });

const CheckoutLog = model("DeviceLog", checkoutLogSchema);

export default CheckoutLog;
