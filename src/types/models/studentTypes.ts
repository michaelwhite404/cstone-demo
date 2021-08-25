import { Document } from "mongoose";
import { TextbookModel } from "./textbookTypes";

export interface StudentModel {
  /** Id of the student */
  _id: any;
  firstName: string;
  lastName: string;
  fullName: string;
  grade?: number;
  schoolEmail: string;
  personalEmail?: string;
  status: "Active" | "Inactive" | "Graduate";
  customID?: string;
  mainPhoto?: string;
  createdAt: Date;
  lastUpdate: Date;
  slug: string;
}

export interface StudentDocument extends StudentModel, Document {
  _id: any;
  textbooksCheckedOut?: TextbookModel[];
}
