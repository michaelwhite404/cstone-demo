import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { StudentModel } from "../../../../src/types/models/studentTypes";
import Table from "../../components/Table/Table";
import { useDocTitle } from "../../hooks";
import { APIError, APIStudentsResponse } from "../../types/apiResponses";

export default function Students() {
  const [students, setStudents] = useState<StudentModel[]>([]);
  useDocTitle("Students | Cornerstone App");
  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "fullName" },
      { Header: "Grade", accessor: "grade", Cell: ({ value }: any) => (value === 0 ? "K" : value) },
      { Header: "RenWeb ID", accessor: "customID" },
      { Header: "Email", accessor: "schoolEmail", width: 200 },
    ],
    []
  );
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

  return (
    <div>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Students</h1>
      </div>
      <Table columns={columns} data={data} sortBy="grade" />
    </div>
  );
}
