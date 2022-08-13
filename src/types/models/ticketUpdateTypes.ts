import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel, TicketModel } from ".";

interface TicketUpdateBase {
  _id: any;
  date: Date;
  createdBy: PopulatedDoc<EmployeeModel>;
  ticket: PopulatedDoc<TicketModel>;
}

export interface TicketCommentModel extends TicketUpdateBase {
  __t: "COMMENT";
  comment: string;
}

export interface TicketAssignModel extends TicketUpdateBase {
  __t: "ASSIGN";
  assign: PopulatedDoc<EmployeeModel>;
  op: "ADD" | "REMOVE";
}

export interface TicketTagModel extends TicketUpdateBase {
  __t: "TAG";
}

export interface TicketCommentDocument extends TicketCommentModel, Document {
  _id: any;
}

export interface TicketAssignDocument extends TicketCommentModel, Document {
  _id: any;
}

export interface TicketTagDocument extends TicketCommentModel, Document {
  _id: any;
}

export type TicketUpdate = TicketCommentModel | TicketAssignModel | TicketTagModel;
