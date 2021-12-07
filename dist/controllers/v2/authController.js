"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthJWT = exports.googleLogin = exports.createEmployee = void 0;
const google_auth_library_1 = require("google-auth-library");
const googleapis_1 = require("googleapis");
const employeeModel_1 = __importDefault(require("../../models/employeeModel"));
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const makePassword_1 = __importDefault(require("../../utils/makePassword"));
const authController_1 = require("../v1/authController");
/**
 * `POST` - Creates new employee
 * - Only users with the role `Super Admin` or `Admin` can access this route
 */
exports.createEmployee = catchAsync_1.default(async (req, res, next) => {
    if (req.employee.role !== "Super Admin" && req.body.role === "Super Admin") {
        return next(new appError_1.default("You are not authorized to create a user with that role", 403));
    }
    const newEmployee = await employeeModel_1.default.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        title: req.body.title,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password || makePassword_1.default(12),
        active: true,
    });
    // const url = `${req.protocol}://${req.get("host")}`;
    // await new Email(req.body, url).sendWelcome();
    // Remove password from output
    // @ts-ignore
    newEmployee.password = undefined;
    res.status(200).json({
        status: "success",
        data: {
            newEmployee,
        },
    });
});
exports.googleLogin = catchAsync_1.default(async (req, res, next) => {
    const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, picture } = ticket.getPayload();
    const employee = await employeeModel_1.default.findOne({ email, active: true });
    if (!employee)
        return next(new appError_1.default("You are not authorized to use this app", 403));
    employee.lastLogin = new Date(req.requestTime);
    employee.image = picture;
    await employee.save();
    authController_1.createSendToken(employee, 200, res);
});
/**
 *
 * @param scopes list of requested scopes or a single scope.
 * @param imperonatedEmail impersonated account's email address.
 */
const googleAuthJWT = (scopes, imperonatedEmail) => {
    var _a;
    const auth = new googleapis_1.google.auth.JWT(process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL, undefined, (_a = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"), scopes, imperonatedEmail);
    return auth;
};
exports.googleAuthJWT = googleAuthJWT;
