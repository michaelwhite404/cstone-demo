import { NextFunction, Request, Response } from "express";
import { JWT, OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import Employee from "../../models/employeeModel";
import { EmployeeModel } from "../../types/models/employeeTypes";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import makePassword from "../../utils/makePassword";
import { createSendToken } from "../v1/authController";

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
