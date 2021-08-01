import { Document } from "mongoose";
import { DeviceModel } from "./deviceTypes";
import { EmployeeModel } from "./employeeTypes";
import { ErrorLogModel } from "./errorLogTypes";
import { StudentModel } from "./studentTypes";

export interface CheckoutLogModel {
  device: DeviceModel;
  checkOutDate: Date;
  checkInDate?: Date;
  dueDate?: Date;
  deviceUser: StudentModel;
  teacherCheckOut: EmployeeModel;
  teacherCheckIn?: EmployeeModel;
  checkedIn: boolean;
  error: ErrorLogModel;
}

export interface CheckoutLogDocument extends CheckoutLogModel, Document {}
