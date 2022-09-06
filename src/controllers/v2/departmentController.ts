import { RequestHandler } from "express";
import { Department, DepartmentMember } from "@models";
import * as factory from "./handlerFactory";
import { catchAsync } from "@utils";

const Model = Department;
const key = "department";

/** `GET` - Gets all departments
 *  - All authernicated users can access this route
 */
export const getAllDepartments: RequestHandler = factory.getAll(
  Model,
  `${key}s`,
  {},
  { path: "membersCount" }
);

/** `GET` - Gets a single department
 *  - All authernicated users can access this route
 */
export const getOneDepartment: RequestHandler = factory.getOneById(Model, key, {
  path: "members membersCount",
});

/** `POST` - Creates a new department
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const createDepartment: RequestHandler = factory.createOne(Model, key);

export const getMyLeaders = catchAsync(async (req, res) => {
  const leaders = await fetchUserLeaders(req.employee);
  res.sendJson(200, { leaders });
});

const fetchUserLeaders = async (employee: Employee) => {
  const myDepartments = employee.departments!;
  const myDeptIds = myDepartments.map((myD) => myD._id.toString());
  const leaders = await DepartmentMember.find({
    department: { $in: myDeptIds },
    role: "LEADER",
  }).populate({ path: "department", select: "name" });
  return leaders.map((l) => ({
    _id: l.member._id,
    fullName: l.member.fullName,
    email: l.member.email,
    department: {
      _id: l.department._id,
      name: l.department.name,
    },
  }));
};
