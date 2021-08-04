import { Document } from "mongoose";
import { TextbookSetModel } from "./textbookSetTypes";
import { StudentModel } from "./studentTypes";
import { EmployeeModel } from "./employeeTypes";

export interface TextbookModel {
  /** Id of the textbook */
  _id: any;
  setId: TextbookSetModel;
  bookNumber: number;
  quality: TextbookQuality;
  status: TextBookStatus;
  checkedOut: boolean;
  active: boolean;
  lastUser?: StudentModel;
  teacherCheckOut?: EmployeeModel;
}

export interface TextbookDocument extends TextbookModel, Document {
  _id: any;
}

type TextbookQuality = "Excellent" | "Good" | "Acceptable" | "Poor";
type TextBookStatus = "Available" | "Checked Out" | "Replaced" | "Not Available";
