const Device = require("../models/deviceModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const CheckoutLog = require("../models/checkoutLogModel");

exports.getAllDevices = factory.getAll(Device);
exports.getDevice = factory.getOne(Device);
exports.createDevice = factory.createOne(Device);
exports.updateDevice = factory.updateOne(Device);
exports.deleteDevice = factory.deleteOne(Device);

exports.checkOutDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);
  
  // If no Device
  if (!device) {
    return next(new AppError(`No ${req.device} found with that ID`, 404));
  }

  // If Not Available
  if (device.status !== "Available") {
    return next(
      new AppError(`This ${req.device} is ${device.status.toLowerCase()}`, 400)
    );
  }
  
  device.checkedOut = true;
  device.lastCheckOut = Date.now();
  device.lastUser = req.body.lastUser;
  device.teacherCheckOut = req.employee.id;
  device.status = "Checked Out";

  await device.save({ validateBeforeSave: false });

  await CheckoutLog.create({
    device: device._id,
    checkOutDate: Date.now(),
    deviceUser: req.body.lastUser,
    teacherCheckOut: req.employee.id,
    checkedIn: false
  });

  res.status(200).json({
    status: "success",
    data: {
      [req.device]: device,
    },
  });
});

exports.checkInDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);
  // If no Device
  if (!device) {
    return next(new AppError(`No ${req.device} found with that ID`, 404));
  }

  // If Not Checked Out
  if (device.status !== "Checked Out") {
    return next(
      new AppError(`This ${req.device} is ${device.status.toLowerCase()}`, 400)
    );
  }

  device.checkedOut = false;
  device.lastCheckIn = Date.now();
  device.teacherCheckOut = undefined;
  device.status = "Available";

  await device.save({ validateBeforeSave: false });

  const log = await CheckoutLog.findOne({ device: device._id, checkedIn: false });
  log.checkInDate = Date.now();
  log.teacherCheckIn = req.employee.id,
  log.checkedIn = true;

  await log.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      [req.device]: device,
    },
  });
});