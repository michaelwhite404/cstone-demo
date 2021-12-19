import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel } from "./employeeTypes";

export interface TimesheetModel {
  /** Id of the timesheet entry */
  _id: any;
  employeeId: PopulatedDoc<EmployeeModel>;
  timeStart: Date;
  timeEnd: Date;
  description: string;
  hours?: number;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: PopulatedDoc<EmployeeModel>;
}

export interface TimesheetEntryDocument extends TimesheetModel, Document {
  _id: TimesheetModel["_id"];
}
