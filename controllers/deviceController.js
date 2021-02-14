const moment = require("moment");
const Device = require("../models/deviceModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const CheckoutLog = require("../models/checkoutLogModel");
const ErrorLog = require("../models/errorLogModel");

exports.getAllDevices = factory.getAll(Device);
exports.getDevice = factory.getOne(Device);
exports.createDevice = factory.createOne(Device);
exports.updateDevice = factory.updateOne(Device);
exports.deleteDevice = factory.deleteOne(Device);

exports.checkOutDevice = catchAsync(async (req, res, next) => {
  const device = await Device.findById(req.params.id);
  const now = moment();
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
  let checkOutDate;
  device.checkedOut = true;
  req.body.lastCheckOut
    ? (device.lastCheckOut = req.body.lastCheckOut)
    : (device.lastCheckOut = now);
  device.lastUser = req.body.lastUser;
  device.teacherCheckOut = req.employee.id;
  device.status = "Checked Out";

  // If Check Out Date is set
  if (req.body.lastCheckOut) {
    // Check If Check Out Date is in the future
    if (moment(req.body.lastCheckOut).diff(now) > 0)
      return next(new AppError("Check out date cannot be in the future", 400));
    checkOutDate = req.body.lastCheckOut;
    device.lastCheckOut = req.body.lastCheckOut;
  }
  // Else Check Out Date is Now
  else {
    checkOutDate = now;
    device.lastCheckOut = now;
  }

  // If Due Date Is Set
  if (req.body.dueDate) {
    // Check If Due Date is in the past
    if (moment(req.body.dueDate).diff(now) < 0) {
      return next(new AppError("Due date cannot be in the past", 400));
    }
    device.dueDate = req.body.dueDate;
  }

  await device.save({ validateBeforeSave: false });

  await CheckoutLog.create({
    device: device._id,
    checkOutDate,
    deviceUser: req.body.lastUser,
    teacherCheckOut: req.employee.id,
    checkedIn: false,
    dueDate: req.body.dueDate,
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

  if (req.body.checkInDate) {
    if (moment(req.body.checkInDate).diff(moment(device.lastCheckOut)) <= 0)
      return next(
        new AppError(
          `A ${req.device} cannot be checked in before it was checked out`,
          400
        )
      );
    // Check If Check Out Date is in the future
    if (moment(req.body.checkInDate).diff(moment()) > 0)
      return next(new AppError("Check in date cannot be in the future", 400));
  }

  device.checkedOut = false;
  device.lastCheckIn = req.body.checkInDate ? req.body.checkInDate : Date.now();
  device.teacherCheckOut = undefined;
  device.dueDate = undefined;

  const log = await CheckoutLog.findOne({
    device: device._id,
    checkedIn: false,
  });
  log.checkInDate = req.body.checkInDate ? req.body.checkInDate : Date.now();
  (log.teacherCheckIn = req.employee.id), (log.checkedIn = true);

  if (req.body.error) {
    const { title, description } = req.body;
    const errorData = {
      title,
      description,
      device: device._id,
      checkInInfo: log._id,
      createdAt: req.body.checkInDate,
    };
    const errorLog = await ErrorLog.create(errorData);
    log.error = errorLog._id;
    device.status = "Broken";
  } else {
    device.status = "Available";
  }

  await device.save({ validateBeforeSave: false });
  await log.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      [req.device]: device,
    },
  });
});

exports.testStatusGroup = catchAsync(async (req, res, next) => {
  const deviceType = req.device;
  const brands = await Device.aggregate([
    {
      $match: { deviceType },
    },
    {
      $group: {
        _id: {
          brand: "$brand",
          status: "$status",
          model: "$model",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          brand: "$_id.brand",
          model: "$_id.model",
        },
        statuses: {
          $push: {
            status: "$_id.status",
            count: "$count",
          },
        },
        count: { $sum: "$count" },
      },
    },
    {
      $group: {
        _id: "$_id.brand",
        models: {
          $push: {
            model: "$_id.model",
            count: "$count",
            statuses: "$statuses",
          },
        },
        count: { $sum: "$count" },
      },
    },
    {
      $project: {
        brand: "$_id",
        count: 1,
        models: 1,
        _id: 0,
      },
    },
    {
      $sort: { brand: 1 },
    },
  ]);

  const statuses = await Device.aggregate([
    {
      $match: { deviceType },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ]);

  const totals = {};
  const totalCount = await Device.countDocuments({ deviceType });
  totals.count = totalCount;
  totals.statuses = statuses;

  res.status(200).json({
    status: "success",
    requestedAt: Date(),
    data: {
      brands,
      totals,
    },
  });
});
