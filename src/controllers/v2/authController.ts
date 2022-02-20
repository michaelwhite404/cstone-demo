import { NextFunction, Request, Response } from "express";
import { JWT, OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { promisify } from "util";
import Employee from "../../models/employeeModel";
import DecodedPayload from "../../types/decodedPayload";
import { EmployeeModel } from "../../types/models/employeeTypes";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import makePassword from "../../utils/makePassword";
import { createSendToken, restrictTo as v1restrictTo } from "../v1/authController";

/**
 * `POST` - Creates new employee
 * - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const createEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.employee.role !== "Super Admin" && req.body.role === "Super Admin") {
      return next(new AppError("You are not authorized to create a user with that role", 403));
    }

    const newEmployee = await Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      title: req.body.title,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password || makePassword(12),
      active: true,
    } as EmployeeModel);

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
  }
);

export const googleLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email, picture } = ticket.getPayload()!;
  const employee = await Employee.findOne({ email, active: true });
  if (!employee) return next(new AppError("You are not authorized to use this app", 403));
  employee.lastLogin = new Date(req.requestTime);
  employee.image = picture;
  await employee.save();
  createSendToken(employee, 200, res);
});

/**
 *
 * @param scopes list of requested scopes or a single scope.
 * @param imperonatedEmail impersonated account's email address.
 */
export const googleAuthJWT = (scopes?: string | string[], imperonatedEmail?: string): JWT => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes,
    imperonatedEmail
  );
  return auth;
};

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }
  // 2.) Verification token
  // @ts-ignore
  const decoded: DecodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET!);
  // console.log(decoded);
  // 3.) Check if employee still exists
  const freshEmployee = await Employee.findById(decoded.id).populate({
    path: "approverOf leaderOf employeeOf",
    select: "name",
  });
  if (!freshEmployee) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }
  // 4.) Check if user changed passsword after the token was issued
  if (freshEmployee.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed password. Please log in again!", 401));
  }
  req.employee = freshEmployee;
  res.locals.employee = freshEmployee;
  // GRANT ACCESS TO PROTECTED ROUTE
  next();
});

export const restrictTo = v1restrictTo;
