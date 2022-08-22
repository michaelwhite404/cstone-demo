import { RequestHandler } from "express";
import { Employee } from "@models";
import * as factory from "./handlerFactory";
import { admin, AppError, catchAsync, isObjectID } from "@utils";
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
  { path: "departments" }
);

/** `GET` - Gets a single employee
 *   - All authorized users can access this route
 */
export const getOneEmployee: RequestHandler = catchAsync(async (req, res, next) => {
  let query = isObjectID(req.params.id.toString())
    ? Model.findById(req.params.id)
    : Model.findOne({ slug: req.params.id });
  query = query.populate({ path: "departments" });
  // if (req.query.projection === "FULL")
  const user = await query;
  if (!user) return next(new AppError("No user found with that ID", 404));
  let groups: models.UserGroup[] | undefined;
  if (req.query.projection === "FULL") {
    groups = await getUserGroups(user.email);
  }
  const { id, __v, ...u } = user.toJSON();
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      user: { ...u, groups },
    },
  });
});

/** Adds current user id to params object */
export const getMe: RequestHandler = (req, _, next) => {
  req.params.id = req.employee._id;
  next();
};

export const getUserGroups = async (email: string): Promise<models.UserGroup[] | undefined> => {
  // prettier-ignore
  const { data: { groups } } = await admin.groups.list({ userKey: email });
  if (!groups) return undefined;

  const membersArray = await Promise.all(
    groups.map((group) => admin.members.get({ groupKey: group.email!, memberKey: email }))
  );

  return membersArray.map((member, i) => ({
    id: groups[i].id!,
    name: groups[i].name!,
    email: groups[i].email!,
    role: member.data.role!,
    status: member.data.status!,
    type: member.data.type!,
  }));
};

/** `GET` - Gets all users from Google
 */
export const getGoogleUsers: RequestHandler = catchAsync(async (req, res) => {
  let query = "";
  if (req.query.active === "true") query = query.concat("isSuspended=false");
  const result = await admin.users.list({
    customer: process.env.GOOGLE_CUSTOMER_ID,
    maxResults: 500,
    query,
  });
  res.sendJson(200, { users: result.data.users });
});

export const addToSpace = catchAsync(async (req, res, next) => {
  const employee = await Employee.findOne({ email: req.body.email });
  if (!employee) return next(new AppError("User not found", 404));
  employee.space = req.body.space;
  employee.save();
  res.status(201).send({ status: "success", message: "User added to space" });
});
