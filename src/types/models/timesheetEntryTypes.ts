import { Document, PopulatedDoc } from "mongoose";
import { DepartmentModel } from "./departmentTypes";
import { EmployeeModel } from "./employeeTypes";

export interface TimesheetModel {
  /** Id of the timesheet entry */
  _id: any;
  employeeId: PopulatedDoc<EmployeeModel>;
  timeStart: Date;
  timeEnd: Date;
  department: PopulatedDoc<DepartmentModel>;
  description: string;
  hours?: number;
  status: "Pending" | "Approved" | "Rejected";
  finalizedBy?: PopulatedDoc<EmployeeModel>;
  finalizedAt?: Date;
}

export interface TimesheetEntryDocument extends TimesheetModel, Document {
  _id: TimesheetModel["_id"];
}
