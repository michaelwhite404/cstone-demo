import { Document, PopulatedDoc } from "mongoose";
import { CheckoutLogModel } from "./checkoutLogTypes";
import { EmployeeModel } from "./employeeTypes";
import { ErrorLogModel } from "./errorLogTypes";
import { StudentModel } from "./studentTypes";

export interface DeviceModel {
  /** Id of the device */
  _id: any;
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
  lastUser?: PopulatedDoc<StudentModel>;
  teacherCheckOut?: PopulatedDoc<EmployeeModel>;
  lastCheckOut?: Date;
  lastCheckIn?: Date;
  slug: string;
  checkouts?: CheckoutLogModel[];
  errorLogs?: ErrorLogModel[];
}

export interface DeviceDocument extends DeviceModel, Omit<Document, "model"> {
  _id: any;
}
