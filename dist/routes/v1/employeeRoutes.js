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
const employeeController = __importStar(require("../../controllers/v1/employeeController"));
const authController = __importStar(require("../../controllers/v1/authController"));
const router = express_1.Router();
// router.post("/signup", authController.protect, authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.post("/create", authController.protect, authController.createEmployee);
router.patch("/update-password", authController.protect, authController.updatePassword);
router.patch("/update-me", authController.protect, employeeController.updateMe);
router.route("/").get(employeeController.getAllEmployees);
router.route("/:id").get(employeeController.getEmployee).patch(employeeController.updateUser);
//   .delete(employeeController.deleteUser);
exports.default = router;
