import {
  model,
  ObjectId,
  Schema,
  SchemaDefinition,
  SchemaTypeOptions,
  Types,
  ValidateFn,
} from "mongoose";
import { DepartmentDocument } from "../types/models/departmentTypes";
import Employee from "./employeeModel";
import FKHelper from "./helpers/foreignKeyHelper";

const validEmployeeValidation = {
  validator: async (id: ObjectId) => FKHelper(Employee, id),
};

const approverValidation = {
  validator: function (id) {
    // @ts-ignore
    const leaders: Array<any> = this.leaders;
    return leaders.includes(id);
  } as ValidateFn<ObjectId>,
  message: "An approver must be a leader in the department",
};

const employeeValidation = {
  validator: function (id) {
    // @ts-ignore
    const leaders: Array<any> = this.leaders;
    return !leaders.includes(id);
  } as ValidateFn<ObjectId>,
  message: "An employee cannot be a leader in the department",
};

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  } as SchemaTypeOptions<string>,
  leaders: [
    {
      type: Types.ObjectId,
      ref: "Employee",
      validate: [validEmployeeValidation],
    } as SchemaTypeOptions<ObjectId>,
  ] as SchemaTypeOptions<ObjectId[]>,
  approvers: [
    {
      type: Types.ObjectId,
      ref: "Employee",
      validate: [validEmployeeValidation, approverValidation],
    } as SchemaTypeOptions<ObjectId>,
  ] as SchemaTypeOptions<ObjectId[]>,
  employees: [
    {
      type: Types.ObjectId,
      ref: "Employee",
      validate: [validEmployeeValidation, employeeValidation],
    } as SchemaTypeOptions<ObjectId>,
  ] as SchemaTypeOptions<ObjectId[]>,
} as SchemaDefinition);

const Department = model<DepartmentDocument>("Department", departmentSchema);

export default Department;
