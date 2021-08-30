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
const authController_1 = require("../../controllers/v1/authController");
const studentController_1 = require("../../controllers/v1/studentController");
const studentController = __importStar(require("../../controllers/v2/studentController"));
const studentRouter = express_1.Router();
studentRouter.use(authController_1.protect);
studentRouter
    .route("/")
    .get(studentController.getAllStudents)
    .post(studentController.createStudent);
studentRouter.get("/group", studentController_1.groupTest);
studentRouter
    .route("/:id")
    .get(studentController.getOneStudent)
    .patch(studentController.updateStudent)
    .delete(studentController.deleteStudent);
exports.default = studentRouter;
