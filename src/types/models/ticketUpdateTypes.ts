import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel, TicketModel } from ".";

interface TicketUpdate {
  _id: any;
  date: Date;
  createdBy: PopulatedDoc<EmployeeModel>;
  ticket: PopulatedDoc<TicketModel>;
}

export interface TicketComment extends TicketUpdate {
  __t: "COMMENT";
  comment: string;
}

export interface TicketAssign extends TicketUpdate {
  __t: "ASSIGN";
  assign: PopulatedDoc<EmployeeModel>;
  op: "ADD" | "REMOVE";
}

export interface TicketTag extends TicketUpdate {
  __t: "TAG";
}

export interface TicketCommentDocument extends TicketComment, Document {
  _id: any;
}
