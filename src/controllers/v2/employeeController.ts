import { RequestHandler } from "express";
import { Employee } from "@models";
import * as factory from "./handlerFactory";
import { admin, AppError, catchAsync } from "@utils";
// import { admin_directory_v1 } from "googleapis";

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
  if (req.query.projection === "FULL") query = query.populate({ path: "departments" });
  const user = await query;
  if (!user) return next(new AppError("No user found with that ID", 404));
  let groups;
  if (req.query.projection === "FULL") {
    const response = await admin.groups.list({
      userKey: user.email,
    });
    groups = response.data.groups || [];
  }
  const { id, __v, ...u } = user.toJSON();
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      user: {
        ...u,
        groups,
      },
    },
  });
});

/** Adds current user id to params object */
export const getMe: RequestHandler = (req, _, next) => {
  req.params.id = req.employee._id;
  next();
};
