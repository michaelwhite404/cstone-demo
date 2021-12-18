import {
  AsyncValidateFn,
  model,
  ObjectId,
  Schema,
  SchemaDefinition,
  SchemaTypeOptions,
  Types,
} from "mongoose";
import { DepartmentDocument } from "../types/models/departmentTypes";
import Employee from "./employeeModel";
import FKHelper from "./helpers/foreignKeyHelper";

const employeeValidation = async (id: ObjectId) =>
  FKHelper(Employee, id, `No employee with id ${id.toString()}`);

const employeeRefArray = [
  {
    type: Types.ObjectId,
    ref: "Employee",
    validate: [{ validator: employeeValidation as AsyncValidateFn<ObjectId> }],
  } as SchemaTypeOptions<ObjectId>,
] as SchemaTypeOptions<ObjectId[]>;

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  } as SchemaTypeOptions<string>,
  leaders: employeeRefArray,
  approvers: employeeRefArray,
  employees: employeeRefArray,
} as SchemaDefinition);

const Department = model<DepartmentDocument>("Department", departmentSchema);

export default Department;
