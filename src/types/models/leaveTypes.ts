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
  approval?: {
    user: PopulatedDoc<EmployeeModel>;
    date: Date;
    approved: boolean;
  };
}

export interface LeaveDocument extends LeaveModel, Document {
  _id: any;
}
