import { TicketAssign } from "@models";
import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel, TicketModel } from ".";

interface TicketUpdateBase {
  _id: any;
  date: Date;
  createdBy: PopulatedDoc<EmployeeModel>;
  ticket: PopulatedDoc<TicketModel>;
}

export interface TicketComment extends TicketUpdateBase {
  __t: "COMMENT";
  comment: string;
}

export interface TicketAssign extends TicketUpdateBase {
  __t: "ASSIGN";
  assign: PopulatedDoc<EmployeeModel>;
  op: "ADD" | "REMOVE";
}

export interface TicketTag extends TicketUpdateBase {
  __t: "TAG";
}

export interface TicketCommentDocument extends TicketComment, Document {
  _id: any;
}

export interface TicketAssignDocument extends TicketComment, Document {
  _id: any;
}

export interface TicketTagDocument extends TicketComment, Document {
  _id: any;
}

export type TicketUpdate = TicketComment | TicketAssign | TicketTag;
