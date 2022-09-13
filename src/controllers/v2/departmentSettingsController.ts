import { DepartmentAvailableSetting, DepartmentSetting } from "@models";
import { catchAsync } from "@utils";
import * as factory from "./handlerFactory";

export const getAllAvailableSettings = factory.getAll(
  DepartmentAvailableSetting,
  "availableSetting"
);
export const getAvailableSetting = factory.getOneById(
  DepartmentAvailableSetting,
  "availableSetting"
);
export const createAvailableSettings = factory.createOne(
  DepartmentAvailableSetting,
  "availableSetting"
);

// =---------------------

export const getAllDepartmentSettings = factory.getAll(DepartmentSetting, "setting");

// export const createDepartmentSettings =
