import axios from "axios";
import { useEffect, useState } from "react";
import { StudentModel } from "../../../../src/types/models";
import { APIAttendanceStatsResponse, APIStudentsResponse } from "../../types/apiResponses";
import StudentsTable from "./StudentsTable";

export default function LionsDenStudents() {
  const [data, setData] = useState<StudentAftercareStat[]>([]);

  useEffect(() => {
    getStudentData();
  }, []);

  const getStudentData = async () => {
    const getAftercareStudents = axios.get<APIStudentsResponse>("/api/v2/aftercare/students", {
      params: { sort: "-grade" },
    });
    const getAftercareData = axios.get<APIAttendanceStatsResponse>(
      "/api/v2/aftercare/attendance/stats"
    );

    const res = await Promise.all([getAftercareStudents, getAftercareData]);
    const { students } = res[0].data.data;
    const { stats } = res[1].data.data;

    const studentList: StudentAftercareStat[] = students.map((student) => {
      const foundStat = stats.find((stat) => stat.student._id === student._id);
      return foundStat
        ? { ...student, entriesCount: foundStat.entriesCount, lateCount: foundStat.lateCount }
        : { ...student, entriesCount: 0, lateCount: 0 };
    });
    setData(studentList);
  };

  return (
    <div>
      <div className="session-header">Students</div>
      <div>
        {/* {students.map((s) => (
          <label style={{ display: "flex", alignItems: "center" }}>
            <Checkbox />
            {s.mainPhoto && (
              <img
                src={s.mainPhoto}
                alt={`${s.fullName}`}
                width={40}
                style={{ borderRadius: 8, boxShadow: "0px 0px 1px rgba(0,0,0,0.1)" }}
              />
            )}
            <div>
              <div>{s.fullName}</div>
              {typeof s.grade === "number" && <div>{numberToGrade(s.grade)}</div>}
            </div>
          </label>
        ))} */}
        <StudentsTable students={data} />
      </div>
    </div>
  );
}

interface StudentAftercareStat extends StudentModel {
  entriesCount: number;
  lateCount: number;
}
