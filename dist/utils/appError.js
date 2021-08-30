"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a readable error for a client
 * @class
 */
class AppError extends Error {
    /**
     *
     * @param {string} message  A brief description of the error
     * @param {number} statusCode The status code of the error
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
