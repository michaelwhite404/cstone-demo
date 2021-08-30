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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deviceLogRoutes_1 = __importDefault(require("./deviceLogRoutes"));
const deviceErrorLogRoutes_1 = __importDefault(require("./deviceErrorLogRoutes"));
const deviceController = __importStar(require("../../controllers/v2/deviceController"));
const v1auth = __importStar(require("../../controllers/v1/authController"));
const helpers = __importStar(require("../../controllers/v2/helpers"));
const deviceRouter = express_1.Router();
const nonManualUpdateKeys = [
    "dueDate",
    "deviceType",
    "checkedOut",
    "lastUser",
    "teacherCheckOut",
    "lastCheckOut",
    "lastCheckIn",
    "slug",
    "status",
];
deviceRouter.use(v1auth.protect);
deviceRouter.use("/logs", deviceLogRoutes_1.default);
deviceRouter.use("/:device/logs", deviceLogRoutes_1.default);
deviceRouter.use("/errors", deviceErrorLogRoutes_1.default);
deviceRouter.use("/:device/errors", deviceErrorLogRoutes_1.default);
deviceRouter.route("/").get(deviceController.getAllDevices).post(deviceController.createDevice);
deviceRouter.get("/types", deviceController.getAllDeviceTypes);
deviceRouter
    .route("/:id")
    .get(deviceController.getOneDevice)
    .patch(helpers.omitFromBody(...nonManualUpdateKeys), deviceController.updateDevice)
    .delete(deviceController.deleteDevice);
deviceRouter.post("/:id/check-out/student/:student_id", deviceController.checkOutDevice);
deviceRouter.post("/:id/check-in", deviceController.checkInDevice);
exports.default = deviceRouter;
