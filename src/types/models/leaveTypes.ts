import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel } from ".";

export interface LeaveModel {
  _id: any;
  user: PopulatedDoc<EmployeeModel>;
  dateStart: Date;
  dateEnd: Date;
  reason: string;
  comments?: string;
  createdAt: Date;
  sendTo: PopulatedDoc<EmployeeModel>;
  approval?: LeaveApproval;
  message?: string;
}

export interface LeaveDocument extends LeaveModel, Document {
  _id: any;
}

export interface LeaveApproval {
  user: PopulatedDoc<EmployeeModel>;
  date: Date;
  approved: boolean;
}
