declare namespace Express {
  import { ObjectId } from "mongoose";
  export interface Request {
    /** Time of the request */
    requestTime: string;

    employee: {
      _id: any;
      email: string;
      role: string;
      timesheetEnabled: boolean;
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
    };
  }
}
