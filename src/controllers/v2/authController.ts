import { NextFunction, Request, Response } from "express";
import Employee from "../../models/employeeModel";
import { EmployeeModel } from "../../types/models/employeeTypes";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import makePassword from "../../utils/makePassword";

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
