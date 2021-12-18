import { NextFunction, Request, RequestHandler, Response } from "express";
import Department from "../../models/DepartmentModel";
import catchAsync from "../../utils/catchAsync";
import * as factory from "./handlerFactory";

const Model = Department;
const key = "device";

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
