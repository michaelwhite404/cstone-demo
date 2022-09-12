import { model, Schema, Types } from "mongoose";

const departmentSettingSchema = new Schema({
  department: {
    type: Types.ObjectId,
    ref: "Department",
    required: true,
  },
  setting: {
    type: Types.ObjectId,
    ref: "DepartmentAvailableSetting",
    required: true,
  },
  allowedSettingValue: {
    type: Types.ObjectId,
    ref: "DepartmentAllowedSettingValue",
  },
  unconstrainedValue: Schema.Types.Mixed,
});

const DepartmentSetting = model("DepartmentSetting", departmentSettingSchema);

export default DepartmentSetting;
