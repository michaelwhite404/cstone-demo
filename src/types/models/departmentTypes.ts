import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel } from ".";

export interface DepartmentModel {
  /** Id of the department */
  _id: any;
  name: string;
  membersCount?: number;
  members?: DepartmentMember[];
}

interface DepartmentMember {
  userId: PopulatedDoc<EmployeeModel>;
  role: "LEADER" | "MEMBER";
}

export interface DepartmentDocument extends DepartmentModel, Document {
  _id: DepartmentModel["_id"];
}
