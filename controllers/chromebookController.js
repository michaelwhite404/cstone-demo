const slugify = require("slugify");
const Chromebook = require("../models/chromebookModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get ALL Chromebooks (GET)
exports.getAllChromebooks = catchAsync(async (req, res, next) => {
  const chromebooks = await Chromebook.find();

  res.status(200).json({
    status: "success",
    results: chromebooks.length,
    data: {
      chromebooks,
    },
  });
});

// Get One Chromebooks (GET)
exports.getChromebook = catchAsync(async (req, res, next) => {
  const chromebook = await Chromebook.findById(req.params.id);

  if (!chromebook) {
    return next(new AppError("No chromebook found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: Date(),
    data: {
      chromebook,
    },
  });
});

// Create new Chromebook (POST)
exports.createChromebook = catchAsync(async (req, res, next) => {
  const newChromebook = await Chromebook.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      chromebook: newChromebook,
    },
  });
});

// Update Chromebook (PATCH)
exports.updateChromebook = catchAsync(async (req, res, next) => {
  if (req.body.slug) req.body.slug = slugify(req.body.name, { lower: true });
  const chromebook = await Chromebook.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!chromebook) {
    return next(new AppError("No chromebook found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      chromebook,
    },
  });
});

// Delete Chromebook (DELETE)
exports.deleteChromebook = catchAsync(async (req, res, next) => {
  const chromebook = await Chromebook.findByIdAndDelete(req.params.id);

  if (!chromebook) {
    return next(new AppError("No chromebook found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.setCurrentUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.chromebook) req.body.chromebook = req.params.id;
  req.body.employee = req.employee.id;
  next();
};

exports.checkOutChromebook = catchAsync(async (req, res, next) => {
  const chromebook = await Chromebook.findById(req.params.id);

  // If no Chromebook
  if (!chromebook) {
    return next(new AppError("No chromebook found with that ID", 404));
  }

  // If Not Available
  if (chromebook.status !== "Available") {
    return next(
      new AppError(`This chromebook is ${chromebook.status.toLowerCase()}`, 400)
    );
  }

  chromebook.checkedOut = true;
  chromebook.lastCheckOut = Date.now();
  chromebook.lastUser = req.body.lastUser;
  chromebook.teacherCheckOut = req.body.employee;
  chromebook.status = "Checked Out";

  await chromebook.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      chromebook,
    },
  });
});

exports.checkInChromebook = catchAsync(async (req, res, next) => {
  const chromebook = await Chromebook.findById(req.params.id);
  // If no Chromebook
  if (!chromebook) {
    return next(new AppError("No chromebook found with that ID", 404));
  }

  // If Not Checked Out
  if (chromebook.status !== "Checked Out") {
    return next(
      new AppError(`This chromebook is ${chromebook.status.toLowerCase()}`, 400)
    );
  }

  chromebook.checkedOut = false;
  chromebook.lastCheckIn = Date.now();
  chromebook.teacherCheckOut = undefined;
  chromebook.status = "Available";

  await chromebook.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      chromebook,
    },
  });
});
