import { Document } from "mongoose";

export interface DepartmentAvailableSettingModel {
  _id: any;
  key: string;
  description: string;
  helpText?: string;
  constrained: boolean;
  dataType: "NUMBER" | "STRING" | "COLOR" | "BOOLEAN" | "MEMBERS";
}

export interface DepartmentAvailableSettingDocument
  extends DepartmentAvailableSettingModel,
    Document {
  _id: DepartmentAvailableSettingModel["_id"];
}
