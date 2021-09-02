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
exports.createSetAndBooks = exports.deleteTextbook = exports.updateTextbook = exports.createTextbook = exports.getOneTextbook = exports.getAllTextbooks = void 0;
// import Textbook from "../../models/textbookModel";
const textbookSetModel_1 = __importDefault(require("../../models/textbookSetModel"));
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const factory = __importStar(require("./handlerFactory"));
const textbookModel_1 = __importDefault(require("../../models/textbookModel"));
const pluralize_1 = __importDefault(require("pluralize"));
var isPlainObject = require("lodash.isplainobject");
const Model = textbookSetModel_1.default;
const key = "textbook";
/** `GET` - Gets all textbooks */
exports.getAllTextbooks = factory.getAll(Model, `${key}s`);
/** `GET` - Gets a single textbook */
exports.getOneTextbook = factory.getOneById(Model, key);
/** `POST` - Creates a single textbook */
exports.createTextbook = factory.createOne(Model, key);
/** `PATCH` - Updates a single textbook */
exports.updateTextbook = factory.updateOne(Model, key);
/** `DELETE` - Deletes textbook */
exports.deleteTextbook = factory.deleteOne(Model, "Textbook");
exports.createSetAndBooks = catchAsync_1.default(async (req, res, next) => {
    if (!Array.isArray(req.body.books))
        return next(new appError_1.default("The 'books' property must be an array", 400));
    const books = req.body.books;
    if (books.every((value) => !(isPlainObject(value) && value.bookNumber && value.quality && value.status))) {
        return next(new appError_1.default("Each index in the 'books' array must be an object with a 'bookNumber', 'quality' and 'status' value", 400));
    }
    const setData = {
        title: req.body.title,
        class: req.body.class,
        grade: req.body.grade,
    };
    const set = await textbookSetModel_1.default.create(setData);
    const mappedBooks = books.map((b) => ({
        ...b,
        textbookSet: set._id,
    }));
    const textbooks = await textbookModel_1.default.create(mappedBooks);
    res.status(200).json({
        status: "success",
        message: `${pluralize_1.default("textbook", textbooks.length, true)} added!`,
    });
});
