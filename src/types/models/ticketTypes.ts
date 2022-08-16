import { Document, PopulatedDoc, Types } from "mongoose";
import { DepartmentModel, EmployeeModel, TicketUpdate } from ".";

export interface TicketModel {
  _id: any;
  description: string;
  department: PopulatedDoc<DepartmentModel>;
  status: TicketStatus;
  updates: TicketUpdate[];
  priority: TicketPriority;
  submittedBy: PopulatedDoc<EmployeeModel>;
  assignedTo: PopulatedDoc<EmployeeModel[]>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketDocument extends TicketModel, Document {
  _id: Types.ObjectId;
  ticketId: number;
}

type TicketStatus = "COMPLETE" | "NOT_STARTED";
type TicketPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
