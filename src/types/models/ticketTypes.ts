import { Document, PopulatedDoc, Types } from "mongoose";
import { DepartmentModel, EmployeeModel } from ".";

export interface TicketModel {
  _id: any;
  description: string;
  department: PopulatedDoc<DepartmentModel>;
  status: TicketStatus;
  updates: TicketUpdate[];
  priority: TicketPriority;
  submittedBy: PopulatedDoc<EmployeeModel>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketDocument extends TicketModel, Document {
  _id: Types.ObjectId;
}

type TicketStatus = "COMPLETE" | "NOT_STARTED";
type TicketPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
interface TicketUpdate {
  description: string;
  date: Date;
  status: TicketStatus;
}
