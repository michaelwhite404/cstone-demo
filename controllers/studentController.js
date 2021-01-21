const Student = require("../models/studentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const slugify = require("slugify");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllStudents = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Student.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
  
  const students = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: students.length,
    data: {
      students,
    },
  });
});

exports.getStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new AppError("No student found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: Date(),
    data: {
      student,
    },
  });
});

exports.createStudent = catchAsync(async (req, res, next) => {
  const newStudent = await Student.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      student: newStudent,
    },
  });
});

// Update Student (PATCH)
exports.updateStudent = catchAsync(async (req, res, next) => {
  req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return next(new AppError("No student found with that ID", 404));
  }

  student.fullName = `${student.firstName} ${student.lastName}`;
  student.slug = slugify(`${student.fullName}`, { lower: true });
  await student.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});

exports.groupTest = catchAsync(async (req, res, next) => {
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

  res.status(200).json({
    status: "success",
    data: {
      grades,
    },
  });
});
