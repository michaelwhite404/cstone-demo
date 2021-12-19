import { NextFunction, Request, RequestHandler, Response } from "express";
import Department from "../../models/DepartmentModel";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import * as factory from "./handlerFactory";

const Model = Department;
const key = "department";

/** `GET` - Gets all departments
 *  - All authernicated users can access this route
 */
export const getAllDepartments: RequestHandler = factory.getAll(Model, `${key}s`);

/** `GET` - Gets a single department
 *  - All authernicated users can access this route
 */
export const getOneDepartment: RequestHandler = factory.getOneById(Model, key);

/** `POST` - Creates a new department
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const createDepartment: RequestHandler = factory.createOne(Model, key);

export const updateDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const [op, key] = req.url.split("/")[2].split("-");
    // Must be an array
    if (!req.body[key] || !Array.isArray(req.body[key]))
      return next(new AppError(`There must be an array for the path '${key}'`, 400));
    // Get department
    const department = await Model.findById(req.params.id);
    if (!department) return next(new AppError("There is no department with this id", 404));

    // @ts-ignore
    const keyArrayStrings: Array<string> = department[key].map(String);
    // If we are adding
    if (op === "add") {
      req.body[key].forEach((id: string) =>
        !keyArrayStrings.includes(id) ? keyArrayStrings.push(id) : ""
      );
    }
    if (op === "remove") {
      req.body[key].forEach(function (id: string) {
        if (keyArrayStrings.includes(id)) {
          const index = keyArrayStrings.indexOf(id);
          console.log(index);
          if (index > -1) keyArrayStrings.splice(index, 1);
        }
      });
    }
    // @ts-ignore
    department[key] = keyArrayStrings;
    await department.save({ validateBeforeSave: true });
    // const department = await Model.findByIdAndUpdate(req.params.id, update, {
    //   new: true,
    //   runValidators: op === "add" ? true : false,
    // });
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        department,
      },
    });
  }
);
