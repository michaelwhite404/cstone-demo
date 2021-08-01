import { Schema, model, Types } from "mongoose";
import slugify from "slugify";
import { DeviceDocument } from "../types/models/deviceTypes";

const deviceSchema = new Schema({
  name: {
    type: String,
    required: [true, "Each Device must have a name"],
    unique: true,
  },
  brand: {
    type: String,
    required: [true, "Each Device has a brand"],
    unique: false,
  },
  model: {
    type: String,
    required: [true, "Each Device has a model"],
    unique: false,
  },
  serialNumber: {
    type: String,
    required: [true, "Each Device must have a serial number"],
    unique: false,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  macAddress: {
    type: String,
    required: [true, "Each Device must have a MAC Address"],
  },
  status: {
    type: String,
    required: [true, "Each Device must have a status"],
    default: "Available",
    enum: {
      values: ["Available", "Checked Out", "Broken", "Not Available"],
      message: "Status is either: Available, Not Available, Broken, Not Available",
    },
  },
  deviceType: {
    type: String,
    required: [true, "Each Device must have a device type"],
  },
  autoUpdateExpiration: String,
  checkedOut: {
    type: Boolean,
    default: false,
  },
  lastUser: {
    type: Types.ObjectId,
    ref: "Student",
  },
  teacherCheckOut: {
    type: Types.ObjectId,
    ref: "Employee",
  },
  lastCheckOut: Date,
  lastCheckIn: Date,
  slug: String,
});

deviceSchema.pre<DeviceDocument>("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Device = model<DeviceDocument>("Device", deviceSchema);

export default Device;
