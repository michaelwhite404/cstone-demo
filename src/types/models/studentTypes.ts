import { Document } from "mongoose";
import { EmployeeModel, TextbookModel, TextbookQuality } from ".";

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
  googleId?: string;
  mainPhoto?: string;
  createdAt: Date;
  lastUpdate: Date;
  slug: string;
  /** Denotes if a student is in aftercare */
  aftercare: boolean;
  textbooks: StudentTextbook[];
}

export interface StudentDocument extends StudentModel, Document {
  _id: any;
  textbooksCheckedOut?: TextbookModel[];
}

export interface StudentTextbook {
  _id: any;
  quality: TextbookQuality;
  bookNumber: TextbookModel["bookNumber"];
  textbookSet: {
    _id: string;
    title: string;
    class: string;
  };
  teacherCheckOut: Pick<EmployeeModel, "_id" | "title" | "email" | "fullName">;
}
