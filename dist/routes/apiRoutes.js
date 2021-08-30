"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const v1Routes_1 = __importDefault(require("./v1/v1Routes"));
const v2Routes_1 = __importDefault(require("./v2/v2Routes"));
const router = express_1.Router();
router.use("/v1", v1Routes_1.default);
router.use(["/v2", "/"], v2Routes_1.default);
exports.default = router;
