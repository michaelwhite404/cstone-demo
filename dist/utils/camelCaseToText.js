"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelCaseToText = (text, lower) => {
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    if (lower)
        return finalResult.toLowerCase();
    return finalResult;
};
exports.default = camelCaseToText;
