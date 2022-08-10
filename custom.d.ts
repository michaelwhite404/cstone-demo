interface Employee {
  _id: any;
  fullName: string;
  email: string;
  role: string;
  timesheetEnabled: boolean;
  homeroomGrade?: number;
  employeeOf?: {
    employees: ObjectId[];
    _id: ObjectId;
    name: string;
  }[];
  approverOf?: {
    employees: ObjectId[];
    _id: ObjectId;
    name: string;
  }[];
  space?: string;
}
declare namespace Express {
  import { ObjectId } from "mongoose";
  import { Send } from "express";

  export interface Request {
    /** Time of the request */
    requestTime: string;
    employee: Employee;
  }

  export interface Response {
    sendJson(statusCode: number, dataObject: any): Express.Response;
  }
}
