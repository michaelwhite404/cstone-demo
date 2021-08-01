"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.isLoggedIn = exports.protect = exports.logout = exports.login = exports.createEmployee = exports.signup = exports.createSendGoogleToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
// import Employee from "../models/employeeModel";
// import catchAsync from "../utils/catchAsync";
// import AppError from "../utils/appError";
// import Email from "../utils/email";
function makePassword(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const createSendToken = (employee, statusCode, res) => {
    const token = signToken(employee._id);
    const cookieOptions = {
        expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    //if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    // Remove password from output
    employee.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            employee,
        },
    });
};
const createSendGoogleToken = (req, res) => {
    const token = signToken(req.user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    res.cookie("jwt", token, cookieOptions);
    res.redirect("/dashboard");
};
exports.createSendGoogleToken = createSendGoogleToken;
exports.signup = catchAsync_1.default(async (req, res, next) => {
    if (req.employee.role !== "Super Admin" && req.body.role === "Super Admin") {
        return next(new appError_1.default("You are not authorized to create a user with that role", 403));
    }
    req.body.password = makePassword(12);
    const newEmployee = await employeeModel_1.default.create(req.body);
    createSendToken(newEmployee, 201, res);
});
exports.createEmployee = catchAsync_1.default(async (req, res, next) => {
    if (req.employee.role !== "Super Admin" && req.body.role === "Super Admin") {
        return next(new appError_1.default("You are not authorized to create a user with that role", 403));
    }
    req.body.password = makePassword(12);
    const newEmployee = await employeeModel_1.default.create(req.body);
    const url = `${req.protocol}://${req.get("host")}`;
    await new Email(req.body, url).sendWelcome();
    // Remove password from output
    newEmployee.password = undefined;
    res.status(200).json({
        status: "success",
        data: {
            newEmployee,
        },
    });
});
exports.login = catchAsync_1.default(async (req, res, next) => {
    const { email, password } = req.body;
    // 1. Check if email and password exist
    if (!email || !password) {
        return next(new appError_1.default("Please provide email and password", 400));
    }
    // 2. Check if employee exists & password is correct
    const employee = await employeeModel_1.default.findOne({ email }).select("+password");
    if (!employee || !(await employee.correctPassword(password, employee.password))) {
        return next(new appError_1.default("Incorrect email or password", 401));
    }
    // 3. If everything is ok, send token to client
    employee.lastLogin = Date.now();
    await employee.save({ validateBeforeSave: false });
    createSendToken(employee, 200, res);
});
const logout = (_, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};
exports.logout = logout;
exports.protect = catchAsync_1.default(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new appError_1.default("You are not logged in", 401));
    }
    // 2.) Verification token
    const decoded = await util_1.promisify(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);
    // 3.) Check if employee still exists
    const freshEmployee = await employeeModel_1.default.findById(decoded.id);
    if (!freshEmployee) {
        return next(new appError_1.default("The user belonging to this token no longer exists.", 401));
    }
    // 4.) Check if used changed passsword after the token was issued
    if (freshEmployee.changedPasswordAfter(decoded.iat)) {
        return next(new appError_1.default("User recently changed password. Please log in again!", 401));
    }
    req.employee = freshEmployee;
    res.locals.employee = freshEmployee;
    // GRANT ACCESS TO PROTECTED ROUTE
    next();
});
// Only for rendered pages, no errors
const isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1.) Verification token
            const decoded = await util_1.promisify(jsonwebtoken_1.default.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            // 2.) Check if user still exists
            const freshEmployee = await employeeModel_1.default.findById(decoded.id);
            if (!freshEmployee) {
                return next();
            }
            // 3.) Check if used changed passsword after the token was issued
            if (freshEmployee.changedPasswordAfter(decoded.iat)) {
                return next();
            }
            // THERE IS A LOGGED IN USER
            res.locals.employee = freshEmployee;
            // console.log(res.locals.employee);
            return next();
        }
        catch (err) {
            return next();
        }
    }
    next();
};
exports.isLoggedIn = isLoggedIn;
const restrictTo = (...roles) => {
    return (req, _, next) => {
        // roles ['admin','lead-guide]
        if (!roles.includes(req.employee.role)) {
            return next(new appError_1.default("You do not have permission to perform this action", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.forgotPassword = catchAsync_1.default(async (req, res, next) => {
    // 1.) Get employee based on POSTed email
    const employee = await employeeModel_1.default.findOne({ email: req.body.email });
    if (!employee) {
        return next(new appError_1.default("There is no employee with this email address", 404));
    }
    // 2.) Generate random token
    const resetToken = employee.createPasswordResetToken();
    await employee.save({ validateBeforeSave: false });
    // 3. Send it to employee's email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.
                    \nIf you didn't forget your password, please ignore this email!`;
    try {
        // await sendEmail({
        //   email: employee.email,
        //   subject: "Your password reset token (valid for 10 min)",
        //   message,
        // });
        await new Email(employee, resetURL).sendPasswordReset();
        res.status(200).json({
            status: "success",
            message: "Token sent to email!",
        });
    }
    catch (err) {
        employee.createPasswordResetToken = undefined;
        employee.createPasswordResetExpires = undefined;
        await employee.save({ validateBeforeSave: false });
        return next(new appError_1.default("There was an error sending the email. Try again later!", 500));
    }
});
exports.resetPassword = catchAsync_1.default(async (req, res, next) => {
    // 1) Get employee based on the token
    const hashedToken = crypto_1.default.createHash("sha256").update(req.params.token).digest("hex");
    const employee = await employeeModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    // 2) If token has not expired, and there is employee, set the new password
    if (!employee) {
        return next(new appError_1.default("Token is invalid or has expired", 400));
    }
    employee.password = req.body.password;
    employee.passwordConfirm = req.body.passwordConfirm;
    employee.passwordResetToken = undefined;
    employee.passwordResetExpires = undefined;
    await employee.save();
    // 3) Update changedPasswordAt property for the employee
    // 4) Log the employee in, send JWT
    createSendToken(employee, 200, res);
});
exports.updatePassword = catchAsync_1.default(async (req, res) => {
    // 1.) Get employee from collection
    const employee = await employeeModel_1.default.findById(req.employee.id).select("+password");
    // 2.) Check if POSTed current password is correct
    // if (
    //   !(await employee.correctPassword(
    //     req.body.passwordCurrent,
    //     employee.password
    //   ))
    // ) {
    //   return next(new AppError("Your current password is wrong", 401));
    // }
    // 3.) If so, update password
    employee.password = req.body.password;
    employee.passwordConfirm = req.body.passwordConfirm;
    await employee.save();
    // 4.) Log employee in, send JWT
    createSendToken(employee, 200, res);
});
