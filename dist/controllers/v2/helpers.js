"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addKeyToQuery = exports.addDeviceToQuery = exports.addParamsToBody = exports.omitFromBody = void 0;
const omitFromObject_1 = __importDefault(require("../../utils/omitFromObject"));
const omitFromBody = (...keys) => {
    return (req, _, next) => {
        omitFromObject_1.default(req.body, ...keys);
        next();
    };
};
exports.omitFromBody = omitFromBody;
const addParamsToBody = (...keys) => {
    return (req, _, next) => {
        keys.forEach((k) => (req.body[k] = req.params[k]));
        next();
    };
};
exports.addParamsToBody = addParamsToBody;
const addDeviceToQuery = (req, _, next) => {
    if (req.params.device)
        req.query.device = req.params.device;
    next();
};
exports.addDeviceToQuery = addDeviceToQuery;
const addKeyToQuery = (key) => {
    return (req, _, next) => {
        if (req.params[key])
            req.query[key] = req.params[key];
        next();
    };
};
exports.addKeyToQuery = addKeyToQuery;
