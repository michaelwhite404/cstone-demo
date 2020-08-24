const Employee = require("../models/employeeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const slugify = require("slugify");

exports.getAllEmployees = catchAsync(async (req, res, next) => {
  const employees = await Employee.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: employees.length,
    data: {
      employees,
    },
  });
});

exports.getEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: Date(),
    data: {
      employee,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /update-password.",
        400
      )
    );
  }
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!employee) {
    return next(new AppError("No user found with that ID", 404));
  }

  employee.fullName = `${employee.firstName} ${employee.lastName}`;
  employee.slug = slugify(`${employee.fullName}`, { lower: true });
  await employee.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      employee,
    },
  });
});
