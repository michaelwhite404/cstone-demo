const mongoose = require("mongoose");
const slugify = require("slugify");

const tabletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Each Tablet must have a name"],
    unique: true,
  },
  brand: {
    type: String,
    required: [true, "Each Tablet has a brand"],
    unique: false,
  },
  model: {
    type: String,
    required: [true, "Each Tablet has a model"],
    unique: false,
  },
  serialNumber: {
    type: String,
    required: [true, "Each Tablet must have a serial number"],
    unique: false,
  },
  macAddress: {
    type: String,
    required: [true, "Each Tablet must have a MAC Address"],
  },
  status: {
    type: String,
    required: [true, "Each Tablet must have a status"],
    default: "Available",
    enum: {
      values: ["Available", "Checked Out", "Broken", "Not Available"],
      message:
        "Status is either: Available, Not Available, Broken, Not Available",
    },
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

tabletSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Tablet = mongoose.model("Tablet", tabletSchema);

module.exports = Tablet;
