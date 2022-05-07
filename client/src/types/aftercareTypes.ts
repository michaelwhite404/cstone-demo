import { StudentModel } from "../../../src/types/models";

export type InactivePageState = "empty" | "students" | "dropIns";

export interface InactiveAftercarePagesProps {
  setPageState: React.Dispatch<React.SetStateAction<InactivePageState>>;
  setStudentsToAdd: React.Dispatch<React.SetStateAction<StudentModel[]>>;
}
