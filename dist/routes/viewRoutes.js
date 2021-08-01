"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const viewsController = __importStar(require("../controllers/viewsController"));
const authController_1 = require("../controllers/authController");
const router = express_1.Router();
router.use(authController_1.isLoggedIn);
// Home Page (Login) - "/"
router.get("/", viewsController.getHomePage);
// Reset Password
router.get("/reset-password/:token");
router.use(authController_1.protect);
// Dashboard - "/dashboard"  (1/2 DONE!!)
router.get("/dashboard", viewsController.getDashboardPage);
// All Chromebooks - "/chromebooks" (DONE!!)
router.get("/chromebooks", (req, _, next) => {
    req.device = "chromebook";
    next();
}, viewsController.getAllDevicesPage);
// Add Chromebook - "/chromebooks/add" (DONE!!)
router.get("/chromebooks/add", (req, _, next) => {
    req.device = "chromebook";
    next();
}, viewsController.addDevicePage);
// Chromebook Stats "/chromebooks/stats" (DONE!!)
router.get("/chromebooks/stats", (req, _, next) => {
    req.device = "chromebook";
    next();
}, viewsController.getDeviceStatsPage);
// Edit Chromebook - "/chromebooks/:slug/edit" (DONE!!)
router.get("/chromebooks/:slug/edit", (req, _, next) => {
    req.device = "chromebook";
    next();
}, viewsController.editDevicePage);
// One Chromebook "/chromebooks/:slug" (DONE!!)
router.get("/chromebooks/:slug", (req, _, next) => {
    req.device = "chromebook";
    next();
}, viewsController.getDevicePage);
// All Tablets - "/tablets" (DONE!!)
router.get("/tablets", (req, _, next) => {
    req.device = "tablet";
    next();
}, viewsController.getAllDevicesPage);
// Add Tablet - "/tablets/add" (DONE!!)
router.get("/tablets/add", (req, _, next) => {
    req.device = "tablet";
    next();
}, viewsController.addDevicePage);
// Tablet Stats "/tablets/stats" (DONE!!)
router.get("/tablets/stats", (req, _, next) => {
    req.device = "tablet";
    next();
}, viewsController.getDeviceStatsPage);
// Edit Tablet - "/tablets/:slug/edit" (DONE!!)
router.get("/tablets/:slug/edit", (req, _, next) => {
    req.device = "tablet";
    next();
}, viewsController.editDevicePage);
// One Tablet "/tablets/:slug" (DONE!!)
router.get("/tablets/:slug", (req, _, next) => {
    req.device = "tablet";
    next();
}, viewsController.getDevicePage);
// All Users (Page not created) - "/users"
// Create user - "/users/new" (DONE!!)
router.get("/users/new", viewsController.createUserPage);
// User (Page not created) - "/user/:slug"
// Edit user - "/users/:slug/edit" (DONE!!)
router.get("/users/:slug/edit", viewsController.editUserPage);
// All students (Page not created) - "/students"
// Student (Page not created) - "/students/:slug"
// Create student - "/students/new" (DONE!!)
router.get("/students/new", viewsController.createStudentPage);
// Edit student - "/students/:slug/edit" (DONE!!)
router.get("/students/:slug/edit", viewsController.editStudentPage);
// New Password
router.get("/new-password", viewsController.getNewPasswordPage);
// Test Route (DONE!!)
router.get("/test-group", viewsController.testGroup);
exports.default = router;
