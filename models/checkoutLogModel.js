const mongoose = require("mongoose");

const checkoutLogSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.ObjectId,
      ref: "Device"
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
      required: false
    },
    deviceUser: {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
      required: true
    },
    teacherCheckOut: {
      type: mongoose.Schema.ObjectId,
      ref: "Employee",
      required: true
    },
    teacherCheckIn: {
      type: mongoose.Schema.ObjectId,
      ref: "Employee"
    },
    checkedIn: {
      type: Boolean,
      default: false
    },
    error: {
      type: mongoose.Schema.ObjectId,
      ref: "ErrorLog",
      required: false,
    }
  }, 
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

checkoutLogSchema.index({device: 1});

const CheckoutLog = mongoose.model("DeviceLog", checkoutLogSchema);

module.exports = CheckoutLog;