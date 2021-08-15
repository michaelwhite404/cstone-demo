import { StudentModel } from "../../../src/types/models/studentTypes";

interface APIResponse<T> {
  status: "success";
  requestedAt: string;
  data: T;
}

export interface APIStudentsResponse extends APIResponse<{ students: StudentModel[] }> {}
export interface APIStudentResponse extends APIResponse<{ student: StudentModel }> {}

export interface APIError {
  status: "fail" | "error";
  message: string;
}