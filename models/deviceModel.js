const mongoose = require("mongoose");
const slugify = require("slugify");

const deviceSchema = new mongoose.Schema({
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
      message:
        "Status is either: Available, Not Available, Broken, Not Available",
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
    type: mongoose.Schema.ObjectId,
    ref: "Student",
  },
  teacherCheckOut: {
    type: mongoose.Schema.ObjectId,
    ref: "Employee",
  },
  lastCheckOut: Date,
  lastCheckIn: Date,
  slug: String,
});

deviceSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
