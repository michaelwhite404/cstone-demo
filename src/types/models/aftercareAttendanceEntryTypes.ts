import { StudentModel } from ".";

export interface AftercareAttendanceEntryModel {
  _id: any;
  student: StudentModel;
  attended: boolean;
  signOutDate?: Date;
  signature?: string;
  lateSignOut?: boolean;
}

export interface AftercareAttendanceEntryDocument extends AftercareAttendanceEntryModel, Document {
  _id: AftercareAttendanceEntryModel["_id"];
}
