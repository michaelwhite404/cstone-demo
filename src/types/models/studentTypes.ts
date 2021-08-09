import { Document } from "mongoose";
import { TextbookModel } from "./textbookTypes";

export interface StudentModel {
  firstName: string;
  lastName: string;
  fullName: string;
  grade?: number;
  schoolEmail: string;
  personalEmail?: string;
  status: string;
  customID?: string;
  mainPhoto?: string;
  createdAt: Date;
  lastUpdate: Date;
  slug: string;
}

export interface StudentDocument extends StudentModel, Document {
  textbooksCheckedOut?: TextbookModel[];
}
