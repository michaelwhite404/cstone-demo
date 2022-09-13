import { DepartmentAllowedSetting, DepartmentAvailableSetting, DepartmentSetting } from "@models";
import { AppError, catchAsync } from "@utils";
import { RequestHandler } from "express";
import validator from "validator";
import * as factory from "./handlerFactory";

export const getAllAvailableSettings = factory.getAll(
  DepartmentAvailableSetting,
  "availableSetting"
);
export const getAvailableSetting = factory.getOneById(
  DepartmentAvailableSetting,
  "availableSetting"
);
export const createAvailableSetting = factory.createOne(
  DepartmentAvailableSetting,
  "availableSetting"
);

// =---------------------

export const getAllDepartmentSettings = factory.getAll(DepartmentSetting, "setting");

export const addDepartmentToBody: RequestHandler = (req, _, next) => {
  req.body.department = req.params.departmentId;
  next();
};

export const createDepartmentSetting = catchAsync(async (req, res, next) => {
  const { department, setting, allowedSettingValue, unconstrainedValue } = req.body;
  const availableSetting = await DepartmentAvailableSetting.findById(setting);
  if (!availableSetting) return next(new AppError("There is no setting with this id ", 400));
  const { dataType, constrained } = availableSetting;
  let departmentSetting;
  if (!constrained) {
    switch (dataType) {
      case "BOOLEAN":
        if (typeof unconstrainedValue !== "boolean")
          return next(new AppError("Value must be a boolean value", 400));
        break;
      case "NUMBER":
        if (typeof unconstrainedValue !== "number")
          return next(new AppError("Value must be a number", 400));
        break;
      case "STRING":
        if (typeof unconstrainedValue !== "string")
          return next(new AppError("Value must be a string", 400));
      case "COLOR":
        if (!validator.isHexColor(unconstrainedValue))
          return next(new AppError("Value must be a hex color", 400));
        break;
    }
    // GTG
    departmentSetting = await DepartmentSetting.create({
      department,
      setting,
      unconstrainedValue,
    });
  } else {
    const allowedSetting = await DepartmentAllowedSetting.findOne({
      _id: allowedSettingValue,
      setting,
    });
    if (!allowedSetting)
      return next(
        new AppError("There is no allowed setting value with this id for this setting", 400)
      );

    departmentSetting = await DepartmentSetting.create({
      department,
      setting,
      allowedSettingValue,
    });
  }

  res.sendJson(201, { setting: departmentSetting });
});
