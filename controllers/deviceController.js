const Device = require("../models/deviceModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

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
  device.teacherCheckOut = req.employee.id;;
  device.status = "Checked Out";

  await device.save({ validateBeforeSave: false });

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

  res.status(200).json({
    status: "success",
    data: {
      [req.device]: device,
    },
  });
});