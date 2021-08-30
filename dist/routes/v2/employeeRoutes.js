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
const employeeController = __importStar(require("../../controllers/v2/employeeController"));
const v1auth = __importStar(require("../../controllers/v1/authController"));
const v2auth = __importStar(require("../../controllers/v2/authController"));
const employeeRouter = express_1.Router();
employeeRouter.post("/login", v1auth.login);
employeeRouter.post("/logout", v1auth.logout);
employeeRouter.post("/google", v2auth.googleLogin);
// employeeRouter.post("/forgot-password", v1auth.forgotPassword); // TODO: Re-do method
// router.patch("/reset-password/:token", v1auth.resetPassword);  // TODO: Re-do method
employeeRouter.use(v1auth.protect);
employeeRouter.patch("/update-password", v1auth.updatePassword);
employeeRouter.route("/").get(employeeController.getAllEmployees).post(v2auth.createEmployee);
employeeRouter.route("/me").get(employeeController.getMe, employeeController.getOneEmployee);
employeeRouter
    .route("/:id")
    .get(employeeController.getOneEmployee) /* .patch(employeeController.updateUser) */;
exports.default = employeeRouter;
