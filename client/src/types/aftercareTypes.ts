import {
  AftercareAttendanceEntryModel,
  AftercareSessionModel,
  StudentModel,
} from "../../../src/types/models";

export type InactivePageState = "empty" | "students" | "dropIns";

export interface InactiveAftercarePagesProps {
  setPageState: React.Dispatch<React.SetStateAction<InactivePageState>>;
  setStudentsToAdd: React.Dispatch<React.SetStateAction<StudentModel[]>>;
  studentsToAdd: StudentModel[];
}

export interface CurrentSession {
  session: AftercareSessionModel | null;
  attendance: AftercareAttendanceEntryModel[];
}
