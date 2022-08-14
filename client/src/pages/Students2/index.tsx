import React, { useEffect, useMemo, useState } from "react";
import { StudentModel } from "../../../../src/types/models/studentTypes";
import { useDocTitle } from "../../hooks";
import cstone from "../../cstone";
import SideTable from "../../components/SideTable/SideTable";
import { Row } from "react-table";
import PageHeader from "../../components/PageHeader";
import SideTableFilter from "../../components/SideTable/SideTableFilter";
import { Outlet } from "react-router-dom";
import EmptyState from "./EmptyState";
import CreateStudent from "./CreateStudent";

function Students2() {
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [filter, setFilter] = useState("");
  useDocTitle("Students | Cornerstone App");
  useEffect(() => {
    const getStudents = async () => {
      const students = await cstone.students.list({
        limit: 500,
      });
      setStudents(students);
    };
    getStudents();
  }, []);

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "fullName" },
      {
        Header: "Grade",
        accessor: "grade",
        id: "grade",
      },
      {
        Header: "Numeric Grade",
        accessor: "grade",
        id: "numericGrade",
      },
      { Header: "RenWeb ID", accessor: "customID" },
      { Header: "Email", accessor: "schoolEmail" },
    ],
    []
  );
  const customMethod = (rows: Row<{}>[]) => {
    //@ts-ignore
    if (rows.length > 0 && rows[0].groupByVal === "0") rows[0].groupByVal = "K";
  };

  const data = useMemo(() => students, [students]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <SideTable
        columns={columns}
        data={data}
        groupBy="grade"
        rowComponent={Comp}
        filterValue={filter}
        customMethod={customMethod}
      >
        <div className="side-table-top">
          <PageHeader text="Students" />
          <SideTableFilter value={filter} onChange={(value) => setFilter(value)} />
        </div>
      </SideTable>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

const Comp = ({ fullName, schoolEmail }: { fullName: string; schoolEmail: string }) => (
  <div style={{ padding: "10px 20px" }}>
    <div>{fullName}</div>
    <div style={{ fontSize: 11.5, color: "#9f9f9f" }}>{schoolEmail}</div>
  </div>
);

Students2.EmptyState = EmptyState;
Students2.CreateStudent = CreateStudent;

export default Students2;
