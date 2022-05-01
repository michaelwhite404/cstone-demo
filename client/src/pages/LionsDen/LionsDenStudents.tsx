import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { StudentModel } from "../../../../src/types/models";
import { useToasterContext } from "../../hooks";
import {
  APIAttendanceStatsResponse,
  APIError,
  APIStudentsResponse,
} from "../../types/apiResponses";
import StudentSearch from "./StudentSearch";
import StudentsTable from "./StudentsTable";

export default function LionsDenStudents() {
  const [data, setData] = useState<StudentAftercareStat[]>([]);
  const [notInA, setNotInA] = useState<StudentModel[]>([]);
  const { showToaster } = useToasterContext();

  useEffect(() => {
    getStudentData();
  }, []);

  const getStudentData = async () => {
    const getAftercareStudents = axios.get<APIStudentsResponse>("/api/v2/students", {
      params: { sort: "-grade", limit: 2000 },
    });
    const getAftercareData = axios.get<APIAttendanceStatsResponse>(
      "/api/v2/aftercare/attendance/stats"
    );

    const res = await Promise.all([getAftercareStudents, getAftercareData]);

    const students: StudentModel[] = [];
    const nonAftercareStudents: StudentModel[] = [];

    res[0].data.data.students.forEach((student) => {
      const array = student.aftercare ? students : nonAftercareStudents;
      array.push(student);
    });
    const { stats } = res[1].data.data;

    const studentList: StudentAftercareStat[] = students.map((student) => {
      const foundStat = stats.find((stat) => stat.student._id === student._id);
      return foundStat
        ? { ...student, entriesCount: foundStat.entriesCount, lateCount: foundStat.lateCount }
        : { ...student, entriesCount: 0, lateCount: 0 };
    });
    setData(studentList);
    setNotInA(nonAftercareStudents);
  };

  const addStudents = async (students: { label: string; value: string }[]) => {
    const data = students.map((s) => ({ id: s.value, op: "add" }));
    try {
      await axios.patch("/api/v2/aftercare/students", { data });
      getStudentData();
      showToaster("Students Added!", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
      throw err;
    }
  };

  return (
    <div>
      <div className="session-header">Students ({data.length})</div>
      <div>
        <StudentSearch students={notInA} onSubmit={addStudents} />
        <StudentsTable students={data} />
      </div>
    </div>
  );
}

interface StudentAftercareStat extends StudentModel {
  entriesCount: number;
  lateCount: number;
}
