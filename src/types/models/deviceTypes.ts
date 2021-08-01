import { Document } from "mongoose";
import { EmployeeModel } from "./employeeTypes";
import { StudentModel } from "./studentTypes";

export interface DeviceModel {
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  dueDate?: Date;
  macAddress: string;
  status: "Available" | "Checked Out" | "Broken" | "Not Available";
  deviceType: string;
  autoUpdateExpiration?: string;
  checkedOut?: boolean;
  lastUser?: StudentModel;
  teacherCheckOut?: EmployeeModel;
  lastCheckOut?: Date;
  lastCheckIn?: Date;
  slug: string;
}

export interface DeviceDocument extends DeviceModel, Document {}
