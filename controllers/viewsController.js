const moment = require("moment");
const catchAsync = require("../utils/catchAsync");
const Device = require("../models/deviceModel");
const AppError = require("../utils/appError");
const Employee = require("../models/employeeModel");
const Student = require("../models/studentModel");
const capitalize = require("capitalize");
const pluralize = require("pluralize");
const CheckoutLog = require("../models/checkoutLogModel");
const ErrorLog = require("../models/errorLogModel");
const camelize = require("../utils/camelize");
const ordinal = require("../utils/ordinal");

exports.getHomePage = (req, res, next) => {
  if (res.locals.employee) {
    res.redirect("/dashboard");
  } else {
    res.status(200).render("login");
  }
};

exports.getDashboardPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard", {
    title: "Dashboard",
  });
});

exports.addDevicePage = (req, res, next) => {
  res.status(200).render("addDevice", {
    title: `Add New ${capitalize(req.device)}`,
    deviceType: req.device,
    capitalize,
  });
};

exports.editDevicePage = catchAsync(async (req, res, next) => {
  const device = await Device.findOne({
    slug: req.params.slug,
    deviceType: req.device,
  });

  if (!device) {
    return next(new AppError(`No ${req.device} found with that ID`, 404));
  }

  res.status(200).render("editDevice", {
    title: `Edit ${capitalize(req.device)}`,
    device,
    key: req.device,
  });
});

exports.getAllDevicesPage = catchAsync(async (req, res, next) => {
  const devices = await Device.find({ deviceType: req.device })
    .sort({ name: 1 })
    .populate({
      path: "lastUser",
      fields: "fullName grade",
    });
  res.status(200).render("allDevices", {
    title: pluralize(capitalize(req.device)),
    key: req.device,
    devices,
    capitalize,
    pluralize,
    ordinal,
    moment,
  });
});

exports.getDevicePage = catchAsync(async (req, res, next) => {
  const device = await Device.findOne({
    slug: req.params.slug,
    deviceType: req.device,
  })
    .populate({
      path: "lastUser",
      fields: "fullName grade",
    })
    .populate({
      path: "teacherCheckOut",
      fields: "fullName email",
    });

  if (!device) {
    return next(new AppError(`No ${req.device} found with that ID`, 404));
  }

  const grades = await Student.aggregate([
    {
      $sort: { lastName: 1 },
    },
    {
      $group: {
        _id: "$grade",
        count: { $sum: 1 },
        students: { $push: { id: "$_id", fullName: "$fullName" } },
      },
    },
    {
      $project: {
        grade: "$_id",
        students: 1,
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { grade: 1 },
    },
  ]);

  const checkOutLog = await CheckoutLog.find({ device: device._id })
    .sort({ checkOutDate: -1 })
    .populate({
      path: "deviceUser teacherCheckOut teacherCheckIn",
      fields: "fullName",
    });

  const errorLogs = await ErrorLog.find({ device: device._id })
    .sort({ createdAt: -1 })
    .populate({
      path: "checkInInfo",
      populate: {
        path: "deviceUser",
        select: "fullName",
      },
    });

  res.status(200).render("oneDevice", {
    title: device.name,
    device,
    grades,
    capitalize,
    key: req.device,
    checkOutLog,
    errorLogs,
    camelize,
    ordinal,
    moment,
  });
});

exports.createUserPage = catchAsync(async (req, res, next) => {
  res.status(200).render("newUser", {
    title: "Create New User",
  });
});

exports.editUserPage = catchAsync(async (req, res, next) => {
  const editEmployee = await Employee.findOne({ slug: req.params.slug });

  if (!editEmployee) {
    return next(new AppError("No employee found with that ID", 404));
  }

  res.status(200).render("editUser", {
    title: "Edit User",
    editEmployee,
  });
});

exports.createStudentPage = catchAsync(async (req, res, next) => {
  res.status(200).render("newStudent", {
    title: "Create New Student",
  });
});

exports.editStudentPage = catchAsync(async (req, res, next) => {
  const student = await Student.findOne({ slug: req.params.slug });

  if (!student) {
    return next(new AppError("No student found with that ID", 404));
  }

  res.status(200).render("editStudent", {
    title: "Edit Student",
    student,
  });
});

exports.getNewPasswordPage = catchAsync(async (req, res, next) => {
  res.status(200).render("newPassword", {
    title: "Create Your New Password",
  });
});

exports.testGroup = catchAsync(async (req, res, next) => {
  const grades = await Student.aggregate([
    {
      $group: {
        _id: "$grade",
        count: { $sum: 1 },
        students: { $push: { id: "$_id", fullName: "$fullName" } },
      },
    },
    {
      $project: {
        grade: "$_id",
        students: 1,
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { grade: 1 },
    },
  ]);

  res.status(200).render("testGroup", {
    title: "Test Grouping",
    grades,
  });
});

exports.getDeviceStatsPage = catchAsync(async (req, res, next) => {
  const deviceType = req.device;
  const brands = await Device.aggregate([
    {
      $match: { deviceType, brand: { $ne: "Fake Inc." } },
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
        insensitive: { $toLower: "$_id" },
        _id: 0,
      },
    },
    {
      $sort: { insensitive: 1 },
    },
  ]);

  const statuses = await Device.aggregate([
    {
      $match: { deviceType, brand: { $ne: "Fake Inc." } },
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
  const totalCount = await Device.countDocuments({
    deviceType,
    brand: { $ne: "Fake Inc." },
  });
  totals.count = totalCount;
  totals.statuses = statuses;

  const getModelStatusCount = (array, status) => {
    const statusIndex = array.findIndex((x) => x.status === status);
    const nOfStatus = statusIndex === -1 ? 0 : array[statusIndex].count;
    return nOfStatus;
  };

  const getBrandStatusCount = (array, status) => {
    let nOfStatus = 0;
    for (let i = 0; i < array.length; i++) {
      nOfStatus += getModelStatusCount(array[i].statuses, status);
    }
    return nOfStatus;
  };

  res.status(200).render("deviceStats", {
    title: `${capitalize(req.device)} Stats`,
    brands,
    totals,
    getModelStatusCount,
    getBrandStatusCount,
  });
});
