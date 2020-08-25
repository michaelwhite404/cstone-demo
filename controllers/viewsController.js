const catchAsync = require("../utils/catchAsync");
const Chromebook = require("../models/chromebookModel");
const Tablet = require("../models/tabletModel");
const AppError = require("../utils/appError");
const Employee = require("../models/employeeModel");
const Student = require("../models/studentModel");

exports.getHomePage = (req, res, next) => {
  if (res.locals.employee) {
    res.redirect("/dashboard");
  }
  res.status(200).render("login");
};

exports.getDashboardPage = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard", {
    title: "Dashboard",
  });
});

exports.addChromebookPage = (req, res, next) => {
  res.status(200).render("addChromebook", {
    title: "Add New Chromebook",
  });
};

exports.getChromebookPage = catchAsync(async (req, res, next) => {
  const chromebook = await Chromebook.findOne({
    slug: req.params.slug,
  })
    .populate({
      path: "lastUser",
      fields: "fullName grade",
    })
    .populate({
      path: "teacherCheckOut",
      fields: "fullName email",
    });

  if (!chromebook) {
    return next(new AppError("No chromebook found with that ID", 404));
  }

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

  res.status(200).render("oneChromebook", {
    title: chromebook.name,
    chromebook,
    grades,
  });
});

exports.editChromebookPage = catchAsync(async (req, res, next) => {
  const chromebook = await Chromebook.findOne({ slug: req.params.slug });

  if (!chromebook) {
    return next(new AppError("No chromebook found with that ID", 404));
  }

  res.status(200).render("editChromebook", {
    title: "Edit Chromebook",
    chromebook,
  });
});

exports.getAllChromebooksPage = catchAsync(async (req, res, next) => {
  const chromebooks = await Chromebook.find().sort({ name: 1 }).populate({
    path: "lastUser",
    fields: "fullName grade",
  });

  res.status(200).render("allChromebooks", {
    title: "Chromebooks",
    chromebooks,
  });
});

exports.addTabletPage = (req, res, next) => {
  res.status(200).render("addTablet", {
    title: "Add New Tablet",
  });
};

exports.getTabletPage = catchAsync(async (req, res, next) => {
  const tablet = await Tablet.findOne({
    slug: req.params.slug,
  })
    .populate({
      path: "lastUser",
      fields: "fullName grade",
    })
    .populate({
      path: "teacherCheckOut",
      fields: "fullName email",
    });

  if (!tablet) {
    return next(new AppError("No tablet found with that ID", 404));
  }

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

  res.status(200).render("oneTablet", {
    title: tablet.name,
    tablet,
    grades,
  });
});

exports.editTabletPage = catchAsync(async (req, res, next) => {
  const tablet = await Tablet.findOne({ slug: req.params.slug });

  if (!tablet) {
    return next(new AppError("No tablet found with that ID", 404));
  }

  res.status(200).render("editTablet", {
    title: "Edit Tablet",
    tablet,
  });
});

exports.getAllTabletsPage = catchAsync(async (req, res, next) => {
  const tablets = await Tablet.find().sort({ name: 1 }).populate({
    path: "lastUser",
    fields: "fullName grade",
  });

  res.status(200).render("allTablets", {
    title: "Tablets",
    tablets,
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
