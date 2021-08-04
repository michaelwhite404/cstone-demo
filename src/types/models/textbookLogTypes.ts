import { Document } from "mongoose";
import { EmployeeModel } from "./employeeTypes";
import { StudentModel } from "./studentTypes";
import { TextbookModel } from "./textbookTypes";

export interface TextbookLogModel {
  /** Id of textbook log */
  _id: any;
  textbook: TextbookModel;
  checkedIn: boolean;
  student: StudentModel;
  checkOutDate: Date;
  teacherCheckOut: EmployeeModel;
  qualityOut: TextbookQuality;
  checkInDate?: Date;
  teacherCheckIn?: EmployeeModel;
  qualityIn?: TextbookQuality;
}

export interface TextbookLogDocument extends TextbookLogModel, Document {
  _id: any;
}

type TextbookQuality = "Excellent" | "Good" | "Acceptable" | "Poor";
