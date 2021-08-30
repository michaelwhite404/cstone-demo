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
const textbookController = __importStar(require("../../controllers/v2/textbookController"));
const authController_1 = require("../../controllers/v1/authController");
const singleTextbookRoutes_1 = __importDefault(require("./singleTextbookRoutes"));
const router = express_1.Router();
router.use(authController_1.protect);
router.use("/books", singleTextbookRoutes_1.default);
router.use("/:textbookSet/books", singleTextbookRoutes_1.default);
router.route("/").get(textbookController.getAllTextbooks).post(textbookController.createTextbook);
router
    .route("/:id")
    .get(textbookController.getOneTextbook)
    .patch(textbookController.updateTextbook)
    .delete(textbookController.deleteTextbook);
exports.default = router;
