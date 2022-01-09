import { CheckoutLogModel } from "../../../src/types/models/checkoutLogTypes";
import { DeviceModel } from "../../../src/types/models/deviceTypes";
import { ErrorLogModel } from "../../../src/types/models/errorLogTypes";
import { StudentModel } from "../../../src/types/models/studentTypes";
import { TextbookSetModel } from "../../../src/types/models/textbookSetTypes";
import { TextbookModel } from "../../../src/types/models/textbookTypes";

interface APIResponse<T> {
  status: "success";
  requestedAt: string;
  data: T;
}

export interface APIStudentsResponse extends APIResponse<{ students: StudentModel[] }> {}
export interface APIStudentResponse extends APIResponse<{ student: StudentModel }> {}

export interface APIDevicesResponse extends APIResponse<{ devices: DeviceModel[] }> {}
export interface APIDeviceResponse extends APIResponse<{ device: DeviceModel }> {}

export interface APICheckoutLogResponse extends APIResponse<{ deviceLogs: CheckoutLogModel[] }> {}

export interface APIErrorLogResponse extends APIResponse<{ errorLog: ErrorLogModel }> {}
export interface APIErrorLogsResponse extends APIResponse<{ errorLogs: ErrorLogModel[] }> {}

export interface APITextbookSetsResponse extends APIResponse<{ textbooks: TextbookSetModel[] }> {}

export interface APITextbooksResponse extends APIResponse<{ books: TextbookModel[] }> {}

export interface APIError {
  status: "fail" | "error";
  message: string;
}
