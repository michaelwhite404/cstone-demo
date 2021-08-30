"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deviceRoutes_1 = __importDefault(require("../v1/deviceRoutes"));
const logRoutes_1 = __importDefault(require("../v1/logRoutes"));
const errorLogRoutes_1 = __importDefault(require("../v1/errorLogRoutes"));
const employeeRoutes_1 = __importDefault(require("../v1/employeeRoutes"));
const studentRoutes_1 = __importDefault(require("../v1/studentRoutes"));
const v1Router = express_1.Router();
v1Router.use("/chromebooks", (req, _, next) => {
    req.device = "chromebook";
    next();
}, deviceRoutes_1.default);
v1Router.use("/tablets", (req, _, next) => {
    req.device = "tablet";
    next();
}, deviceRoutes_1.default);
v1Router.use("/error-logs", (req, _, next) => {
    req.key = "error";
    next();
}, errorLogRoutes_1.default);
v1Router.use("/logs", (req, _, next) => {
    req.key = "log";
    next();
}, logRoutes_1.default);
v1Router.use("/users", employeeRoutes_1.default);
v1Router.use("/students", studentRoutes_1.default);
exports.default = v1Router;
