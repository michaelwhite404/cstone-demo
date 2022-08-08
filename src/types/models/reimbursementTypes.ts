import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel } from ".";

export interface ReimbursementModel {
  user: PopulatedDoc<EmployeeModel>;
  date: Date;
  amount: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  purpose: string;
  createdAt: Date;
  receipt: string;
  approval?: {
    user: PopulatedDoc<EmployeeModel>;
    date: Date;
    approved: boolean;
  };
}

export interface ReimbursementDocument extends ReimbursementModel, Document {}
