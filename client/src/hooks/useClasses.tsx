import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { APIError } from "../types/apiResponses";
import Class from "../types/class";
import { grades } from "../utils/grades";
import { HTMLSelect } from "@blueprintjs/core";

interface IUseClasses {
  classes: Class[];
  /** HTML Select component of all grades in the school. Selecting an grade option value
   * changes the options in the `GradeSelect` component and the gradePicked variable.
   */
  GradeSelect: () => JSX.Element;
  /** HTML Select component of all students in a given grade. Student options are
   * determined by the gradePicked variable.
   * */
  StudentSelect: () => JSX.Element;
  /** The current selected grade. -1 if no grade is selected  */
  gradePicked: number;
  /** The current selected sudent. "-1" if no student is selected  */
  studentPicked: string;
}

export default function useClasses(): IUseClasses {
  const [classes, setClasses] = useState<Class[]>([]);
  const [gradePicked, setGradePicked] = useState(-1);
  const [studentPicked, setStudentPicked] = useState<string>("-1");

  useEffect(() => {
    getClasses();

    async function getClasses() {
      try {
        const res = await axios.get("/api/v2/students/group");
        setClasses(res.data.data.grades);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, []);

  const gradeValues = grades.map((value, i) => ({
    value: `${i}`,
    label: i === 0 ? "Kindergarten" : value,
  }));
  gradeValues.unshift({ value: "-1", label: "Select a grade" });
  const selectAStudent = { label: "Select A Student", value: "-1" };
  const studentOptions =
    gradePicked === -1
      ? undefined
      : classes[gradePicked].students.map((s) => ({
          label: s.fullName,
          value: s.id,
        }));
  studentOptions?.unshift(selectAStudent);

  const changeGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGradePicked(+e.target.value);
    setStudentPicked("-1");
  };

  const GradeSelect = () => (
    <HTMLSelect value={gradePicked} options={gradeValues} onChange={changeGrade} />
  );
  const StudentSelect = () => (
    <HTMLSelect
      disabled={gradePicked < 0}
      value={studentPicked}
      options={studentOptions || [selectAStudent]}
      onChange={(e) => setStudentPicked(e.target.value)}
    />
  );

  return { classes, GradeSelect, StudentSelect, gradePicked, studentPicked };
}
