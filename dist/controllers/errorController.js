"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new appError_1.default(message, 400);
};
const handleJWTError = () => new appError_1.default("Invalid Token. Please log in again!", 401);
const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    return res.status(err.statusCode).render("error", {
        title: err.statusCode + " Error",
        message: err.message,
    });
};
const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith("/api")) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // B) Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error("ERROR 💥", err);
        // 2) Send generic message
        return res.status(500).json({
            title: err.statusCode + " Error",
            message: err.message,
        });
    }
    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).render("error", {
            title: err.statusCode + " Error",
            message: err.message,
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: "Please try again later.",
    });
};
exports.default = (err, req, res, _) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = Object.assign(err);
        if (error.name === "CastError")
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError")
            error = handleJWTError();
        sendErrorProd(error, req, res);
    }
};
