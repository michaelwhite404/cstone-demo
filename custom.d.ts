interface Employee {
  _id: any;
  fullName: string;
  email: string;
  role: string;
  timesheetEnabled: boolean;
  homeroomGrade?: number;
  image?: string;
  slug: string;
  departments?: UserDepartment[];
  space?: string;
}

interface UserDepartment {
  _id: DepartmentModel["_id"];
  name: string;
  role: "LEADER" | "EMPLOYEE";
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
