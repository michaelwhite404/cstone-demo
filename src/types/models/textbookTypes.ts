import { Document, PopulatedDoc } from "mongoose";
import { TextbookSetModel } from "./textbookSetTypes";
import { StudentModel } from "./studentTypes";
import { EmployeeModel } from "./employeeTypes";

export interface TextbookModel {
  /** Id of the textbook */
  _id: any;
  textbookSet: TextbookSetModel;
  bookNumber: number;
  quality: TextbookQuality;
  status: TextBookStatus;
  active: boolean;
  lastUser?: PopulatedDoc<StudentModel>;
  teacherCheckOut?: PopulatedDoc<EmployeeModel>;
}

export interface TextbookDocument extends TextbookModel, Document {
  _id: any;
}

type TextbookQuality = "Excellent" | "Good" | "Acceptable" | "Poor";
type TextBookStatus = "Available" | "Checked Out" | "Replaced" | "Not Available";
