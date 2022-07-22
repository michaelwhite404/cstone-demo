import { RequestHandler } from "express";
import { Employee } from "@models";
import * as factory from "./handlerFactory";
import { AppError, catchAsync } from "@utils";

const Model = Employee;
const key = "user";

/** `GET` - Gets all employees
 *  - All authorized users can access this route
 */
export const getAllEmployees: RequestHandler = factory.getAll(
  Model,
  key,
  {},
  { path: "departments" }
);

/** `GET` - Gets a single employee
 *   - All authorized users can access this route
 */
export const getOneEmployee: RequestHandler = catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  let groups = [""];
  if (req.query.projection === "FULL") {
    query = query.populate({ path: "departments" });
  }
  const user = await query;
  if (!user) return next(new AppError("No user found with that ID", 404));

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      user,
    },
  });
});

// factory.getOneById(Model, key, {
//   path: "departments",
// });

/** Adds current user id to params object */
export const getMe: RequestHandler = (req, _, next) => {
  req.params.id = req.employee._id;
  next();
};
