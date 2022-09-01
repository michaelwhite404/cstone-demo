import { DepartmentMember } from "@models";
import { AppError, catchAsync } from "@utils";
import { RequestHandler } from "express";
import * as factory from "./handlerFactory";

export const getAllDepartmentMembers = catchAsync(async (req, res) => {
  const members = await DepartmentMember.find({ department: req.params.departmentId });
  res.sendJson(200, { members });
});

export const createDepartmentMember = factory.createOne(DepartmentMember, "member");
export const addDepartmentIdToBody: RequestHandler = (req, _, next) => (
  (req.body.department = req.params.departmentId), next()
);

export const getDepartmentMember = catchAsync(async (req, res, next) => {
  const member = await DepartmentMember.findOne({
    department: req.params.departmentId,
    member: req.params.id,
  });
  if (!member) return next(new AppError("No member found", 404));

  res.sendJson(200, { member });
});

export const removeDepartmentMember = catchAsync(async (req, res, next) => {
  const member = await DepartmentMember.findOneAndDelete({
    department: req.params.departmentId,
    member: req.params.id,
  });
  if (!member) return next(new AppError("No member found", 404));
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    message: "1 member removed from the department",
  });
});
