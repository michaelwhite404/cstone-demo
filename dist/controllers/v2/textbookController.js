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
exports.deleteTextbook = exports.updateTextbook = exports.createTextbook = exports.getOneTextbook = exports.getAllTextbooks = void 0;
// import Textbook from "../../models/textbookModel";
const textbookSetModel_1 = __importDefault(require("../../models/textbookSetModel"));
const factory = __importStar(require("./handlerFactory"));
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
