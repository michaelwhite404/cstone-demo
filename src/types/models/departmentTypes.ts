import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel } from ".";

export interface DepartmentModel {
  /** Id of the department */
  _id: any;
  name: string;
  leaders: PopulatedDoc<EmployeeModel[]>;
  approvers: PopulatedDoc<EmployeeModel[]>;
  employees: PopulatedDoc<EmployeeModel>[];
}

export interface DepartmentDocument extends DepartmentModel, Document {
  _id: DepartmentModel["_id"];
}
