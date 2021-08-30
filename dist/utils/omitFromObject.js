"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const omitFromObject = (obj, ...keys) => {
    keys.forEach((key) => delete obj[key]);
    return obj;
};
exports.default = omitFromObject;
