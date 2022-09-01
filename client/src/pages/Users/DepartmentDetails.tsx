import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DepartmentModel } from "../../../../src/types/models";
import BackButton from "../../components/BackButton";

export default function DepartmentDetails() {
  const [department, setDepartment] = useState<DepartmentModel>();
  const { id } = useParams<"id">();
  useEffect(() => {
    const fetchDepartment = async () => {
      const res = await axios.get(`/api/v2/departments/${id}`);
      console.log(res.data.data.department);
      setDepartment(res.data.data.department);
    };

    fetchDepartment();
  }, [id]);

  return (
    <div className="flex flex-col" style={{ padding: "10px 25px 25px" }}>
      <div className="my-4 hover:underline cursor-pointer">
        <BackButton />
        Back to departments
      </div>
      {department && (
        <div>
          <div className="mb-5">
            <h1>{department?.name}</h1>
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
}
