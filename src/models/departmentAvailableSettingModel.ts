import { model, Schema } from "mongoose";

const availableSettingSchema = new Schema({
  description: String,
  constrained: {
    type: Boolean,
    required: true,
  },
  dataType: {
    type: String,
    enum: ["NUMBER", "STRING", "COLOR", "BOOLEAN"],
    required: true,
  },
});

const DepartmentAvailableSetting = model("DepartmentAvailableSetting", availableSettingSchema);

export default DepartmentAvailableSetting;
