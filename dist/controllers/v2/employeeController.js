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
exports.getMe = exports.getOneEmployee = exports.getAllEmployees = void 0;
const employeeModel_1 = __importDefault(require("../../models/employeeModel"));
const factory = __importStar(require("./handlerFactory"));
const Model = employeeModel_1.default;
const key = "user";
/** `GET` - Gets all employees
 *  - All authorized users can access this route
 */
exports.getAllEmployees = factory.getAll(Model, key);
/** `GET` - Gets a single employee
 *   - All authorized users can access this route
 */
exports.getOneEmployee = factory.getOneById(Model, key);
/** Adds current user id to params object */
const getMe = (req, _, next) => {
    req.params.id = req.employee._id;
    next();
};
exports.getMe = getMe;
