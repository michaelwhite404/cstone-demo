import Employee from "../../models/employeeModel";
import * as factory from "./handlerFactory";

const Model = Employee;
const key = "user";

/** `GET` - Gets all employees */
export const getAllEmployees = factory.getAll(Model, key);
/** `GET` - Gets a single employee */
export const getOneEmployee = factory.getOne(Model, key);
