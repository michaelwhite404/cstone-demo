const slugify = require("slugify");
const Tablet = require("../models/tabletModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get ALL Tablets (GET)
exports.getAllTablets = catchAsync(async (req, res, next) => {
  const tablets = await Tablet.find();

  res.status(200).json({
    status: "success",
    results: tablets.length,
    data: {
      tablets,
    },
  });
});

// Get One Tablets (GET)
exports.getTablet = catchAsync(async (req, res, next) => {
  const tablet = await Tablet.findById(req.params.id);

  if (!tablet) {
    return next(new AppError("No tablet found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: Date(),
    data: {
      tablet,
    },
  });
});

// Create new Tablet (POST)
exports.createTablet = catchAsync(async (req, res, next) => {
  const newTablet = await Tablet.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tablet: newTablet,
    },
  });
});

// Update Tablet (PATCH)
exports.updateTablet = catchAsync(async (req, res, next) => {
  if (req.body.slug) req.body.slug = slugify(req.body.name, { lower: true });
  const tablet = await Tablet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tablet) {
    return next(new AppError("No tablet found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tablet,
    },
  });
});

// Delete Tablet (DELETE)
exports.deleteTablet = catchAsync(async (req, res, next) => {
  const tablet = await Tablet.findByIdAndDelete(req.params.id);

  if (!tablet) {
    return next(new AppError("No tablet found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.setCurrentUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tablet) req.body.tablet = req.params.id;
  req.body.employee = req.employee.id;
  next();
};

exports.checkOutTablet = catchAsync(async (req, res, next) => {
  const tablet = await Tablet.findById(req.params.id);

  // If no Tablet
  if (!tablet) {
    return next(new AppError("No tablet found with that ID", 404));
  }

  // If Not Available
  if (tablet.status !== "Available") {
    return next(
      new AppError(`This tablet is ${tablet.status.toLowerCase()}`, 400)
    );
  }

  tablet.checkedOut = true;
  tablet.lastCheckOut = Date.now();
  tablet.lastUser = req.body.lastUser;
  tablet.teacherCheckOut = req.body.employee;
  tablet.status = "Checked Out";

  await tablet.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      tablet,
    },
  });
});

exports.checkInTablet = catchAsync(async (req, res, next) => {
  const tablet = await Tablet.findById(req.params.id);
  // If no Tablet
  if (!tablet) {
    return next(new AppError("No tablet found with that ID", 404));
  }

  // If Not Checked Out
  if (tablet.status !== "Checked Out") {
    return next(
      new AppError(`This tablet is ${tablet.status.toLowerCase()}`, 400)
    );
  }

  tablet.checkedOut = false;
  tablet.lastCheckIn = Date.now();
  tablet.teacherCheckOut = undefined;
  tablet.status = "Available";

  await tablet.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      tablet,
    },
  });
});
