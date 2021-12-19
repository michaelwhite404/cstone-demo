import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel } from "./employeeTypes";

interface DepartmentModel {
  /** Id of the department */
  _id: any;
  leaders: PopulatedDoc<EmployeeModel[]>;
  approvers: PopulatedDoc<EmployeeModel[]>;
  employees: PopulatedDoc<EmployeeModel>[];
}

export interface DepartmentDocument extends DepartmentModel, Document {
  _id: DepartmentModel["_id"];
}
