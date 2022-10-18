import { RequestHandler } from "express";
import { Employee } from "@models";
import * as factory from "./handlerFactory";
import { AppError, catchAsync, isObjectID } from "@utils";
import { models } from "@@types";

const Model = Employee;
const key = "user";

/** `GET` - Gets all employees
 *  - All authorized users can access this route
 */
export const getAllEmployees: RequestHandler = factory.getAll(
  Model,
  key,
  {},
  { path: "departments test" }
);

/** `GET` - Gets a single employee
 *   - All authorized users can access this route
 */
export const getOneEmployee: RequestHandler = catchAsync(async (req, res, next) => {
  let query = isObjectID(req.params.id.toString())
    ? Model.findById(req.params.id)
    : Model.findOne({ slug: req.params.id });
  query = query.populate({ path: "departments", populate: "department" });
  // if (req.query.projection === "FULL")
  const user = await query;
  if (!user) return next(new AppError("No user found with that ID", 404));
  let groups: models.UserGroup[] | undefined;
  const { id, __v, ...u } = user.toJSON();

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      user: { ...formatDepartments(u), groups },
    },
  });
});

const formatDepartments = (user: any) => {
  user.departments = user.departments.map((d: any) => ({
    _id: d.department._id,
    name: d.department.name,
    role: d.role,
  }));
  return user;
};

/** Adds current user id to params object */
export const getMe: RequestHandler = (req, _, next) => {
  req.params.id = req.employee._id;
  next();
};

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

export const updateUser = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "title",
    "role",
    "email",
    "homeroomGrade",
    "timesheetEnabled"
  );
  const queryOptions = {
    new: true,
    runValidators: true,
    populate: { path: "departments", populate: { path: "department" } },
  };
  let query = isObjectID(req.params.id.toString())
    ? Model.findByIdAndUpdate(req.params.id, filteredBody, queryOptions)
    : Model.findOneAndUpdate({ slug: req.params.id }, filteredBody, queryOptions);
  const user = await query;
  if (!user) return next(new AppError("No user found with that ID", 404));
  if (filteredBody.firstName || filteredBody.lastName) {
    user.fullName = `${user.firstName} ${user.lastName}`;
    // user.slug = slugify(user.fullName, { lower: true });
    await user.save();
  }

  res.sendJson(200, { user: formatDepartments(user) });
});
