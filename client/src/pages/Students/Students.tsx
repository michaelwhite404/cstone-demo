import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { StudentModel } from "../../../../src/types/models/studentTypes";
import Table from "../../components/Table/Table";
import { APIError, APIStudentsResponse } from "../../types/apiResponses";
import STUDENT_COLUMNS from "./StudentColumns";

export default function Students() {
  const [students, setStudents] = useState<StudentModel[]>([]);
  const columns = useMemo(() => STUDENT_COLUMNS, []);
  const data = useMemo(() => students, [students]);
  useEffect(() => {
    getStudents();

    async function getStudents() {
      try {
        const res = await axios.get<APIStudentsResponse>("/api/v2/students", {
          params: {
            sort: "grade,lastName",
            limit: 1000,
            status: "Active",
          },
        });
        setStudents(res.data.data.students);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, []);

  return <Table columns={columns} data={data} />;
}
