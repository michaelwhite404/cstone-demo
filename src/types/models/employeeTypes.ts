import { Document } from "mongoose";

export interface EmployeeModel {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  homeroomGrade?: number;
  title: string;
  role: string;
  image?: String;
  googleId?: String;
  password: string;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: String;
  passwordResetExpires?: Date;
  createdAt: Date;
  active: boolean;
  slug: string;
}

export interface EmployeeDocument extends EmployeeModel, Document {}
