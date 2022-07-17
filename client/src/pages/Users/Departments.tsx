import axios from "axios";
import { useEffect, useState } from "react";
import { DepartmentModel } from "../../../../src/types/models";
import DepartmentsTable from "./DepartmentsTable";

export default function Departments() {
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);

  const fetchDepartments = async () => {
    const res = await axios.get("/api/v2/departments");
    setDepartments(res.data.data.departments);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div>
      <DepartmentsTable departments={departments} />
    </div>
  );
}
