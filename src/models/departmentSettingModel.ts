import { Department, DepartmentAllowedSetting, DepartmentAvailableSetting } from "@models";
import { model, ObjectId, Schema, Types } from "mongoose";
import FKHelper from "./helpers/foreignKeyHelper";

const departmentSettingSchema = new Schema({
  department: {
    type: Types.ObjectId,
    ref: "Department",
    required: true,
    validate: {
      validator: async (id: ObjectId) => FKHelper(Department, id),
    },
  },
  setting: {
    type: Types.ObjectId,
    ref: "DepartmentAvailableSetting",
    required: true,
    validate: { validator: async (id: ObjectId) => FKHelper(DepartmentAvailableSetting, id) },
  },
  allowedSettingValue: {
    type: Types.ObjectId,
    ref: "DepartmentAllowedSettingValue",
    validate: { validator: async (id: ObjectId) => FKHelper(DepartmentAllowedSetting, id) },
  },
  unconstrainedValue: {
    type: Schema.Types.Mixed,
  },
});

departmentSettingSchema.index({ department: 1, setting: 1 }, { unique: true });

const DepartmentSetting = model("DepartmentSetting", departmentSettingSchema);

export default DepartmentSetting;
