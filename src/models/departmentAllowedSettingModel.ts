import { model, Schema, Types } from "mongoose";

const allowedSettingValueSchema = new Schema({
  setting: {
    type: Types.ObjectId,
    ref: "DepartmentAvailableSetting",
    required: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
  caption: {
    type: String,
    required: false,
    minLength: 1,
  },
});

const DepartmentAllowedSettingValue = model(
  "DepartmentAllowedSettingValue",
  allowedSettingValueSchema
);

export default DepartmentAllowedSettingValue;
