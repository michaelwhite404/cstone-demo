import { RequestHandler } from "express";
import Employee from "../../models/employeeModel";
import * as factory from "./handlerFactory";

const Model = Employee;
const key = "user";

/** `GET` - Gets all employees
 *  - All authorized users can access this route
 */
export const getAllEmployees: RequestHandler = factory.getAll(Model, key);

/** `GET` - Gets a single employee
 *   - All authorized users can access this route
 */
export const getOneEmployee: RequestHandler = factory.getOneById(Model, key);

/** Adds current user id to params object */
export const getMe: RequestHandler = (req, _, next) => {
  req.params.id = req.employee._id;
  next();
};
