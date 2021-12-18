import { model, ObjectId, Schema, SchemaDefinition, SchemaTypeOptions, Types } from "mongoose";
import { DepartmentDocument } from "../types/models/departmentTypes";

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  } as SchemaTypeOptions<string>,
  leaders: {
    type: [Types.ObjectId],
    ref: "Employee",
  } as SchemaTypeOptions<ObjectId[]>,
  approvers: {
    type: [Types.ObjectId],
    ref: "Employee",
  } as SchemaTypeOptions<ObjectId[]>,
  employees: {
    type: [Types.ObjectId],
    ref: "Employee",
  } as SchemaTypeOptions<ObjectId[]>,
} as SchemaDefinition);

const Department = model<DepartmentDocument>("Department", departmentSchema);

export default Department;
