const express = require("express");

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

// Home Page (Login) - "/"
router.get("/", viewsController.getHomePage);

// Dashboard - "/dashboard"  (1/2 DONE!!)
router.get(
  "/dashboard",
  authController.protect,
  viewsController.getDashboardPage
);

// All Chromebooks - "/chromebooks" (DONE!!)
router.get(
  "/chromebooks",
  authController.protect,
  viewsController.getAllChromebooksPage
);

// Add Chromebook - "/chromebooks/add" (DONE!!)
router.get(
  "/chromebooks/add",
  authController.protect,
  viewsController.addChromebookPage
);

// Edit Chromebook - "/chromebooks/:slug/edit" (DONE!!)
router.get(
  "/chromebooks/:slug/edit",
  authController.protect,
  viewsController.editChromebookPage
);

// One Chromebook "/chromebooks/:slug" (DONE!!)
router.get(
  "/chromebooks/:slug",
  authController.protect,
  viewsController.getChromebookPage
);

// All Tablets - "/tablets" (DONE!!)
router.get(
  "/tablets",
  authController.protect,
  viewsController.getAllTabletsPage
);

// Add Tablet - "/tablets/add" (DONE!!)
router.get(
  "/tablets/add",
  authController.protect,
  viewsController.addTabletPage
);

// Edit Tablet - "/tablets/:slug/edit" (DONE!!)
router.get(
  "/tablets/:slug/edit",
  authController.protect,
  viewsController.editTabletPage
);

// One Tablet "/tablets/:slug" (DONE!!)
router.get(
  "/tablets/:slug",
  authController.protect,
  viewsController.getTabletPage
);

// All Users (Page not created) - "/users"

// Create user - "/users/new" (DONE!!)
router.get(
  "/users/new",
  authController.protect,
  viewsController.createUserPage
);

// User (Page not created) - "/user/:slug"

// Edit user - "/users/:slug/edit" (DONE!!)
router.get(
  "/users/:slug/edit",
  authController.protect,
  viewsController.editUserPage
);

// All students (Page not created) - "/students"

// Student (Page not created) - "/students/:slug"

// Create student - "/students/new" (DONE!!)
router.get(
  "/students/new",
  authController.protect,
  viewsController.createStudentPage
);

// Edit student - "/students/:slug/edit" (DONE!!)
router.get(
  "/students/:slug/edit",
  authController.protect,
  viewsController.editStudentPage
);

// New Password
router.get(
  "/new-password",
  authController.protect,
  viewsController.getNewPasswordPage
);

// Reset Password
router.get("/reset-password/:token");

// Test Route (DONE!!)
router.get("/test-group", viewsController.testGroup);

module.exports = router;
