import axios from "axios";
import React, { useEffect, useState } from "react";
import { StudentModel } from "../../../../src/types/models";
import FadeIn from "../../components/FadeIn";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import useChecker from "../../hooks/useChecker";
import { APIStudentsResponse } from "../../types/apiResponses";

type InactivePageState = "empty" | "students" | "dropIns";

export default function InactiveSession() {
  const [pageState, setPageState] = useState<InactivePageState>("empty");

  const pages = [
    { state: "empty", Component: EmptyPage },
    { state: "students", Component: AddStudents },
  ];

  const { Component } = pages.find((page) => page.state === pageState)!;

  return <Component setPageState={setPageState} />;
}

const EmptyPage = ({
  setPageState,
}: {
  setPageState: React.Dispatch<React.SetStateAction<InactivePageState>>;
}) => (
  <FadeIn>
    <div className="flex justify-end mb-10">
      <PrimaryButton onClick={() => setPageState("students")}>Start Session</PrimaryButton>
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 300 }}>
        <img src="/SleepingStudent.png" alt="Sleeping Student" />
        <p style={{ textAlign: "center", marginTop: 15, color: "gray" }}>
          There is no active session
        </p>
      </div>
    </div>
  </FadeIn>
);

const AddStudents = () => {
  const [students, setStudents] = useState<StudentModel[]>([]);
  const { CheckAllBox, rows } = useChecker(students);

  useEffect(() => {
    getAftercareStudents();
  }, []);

  const getAftercareStudents = async () => {
    const res = await axios.get<APIStudentsResponse>("/api/v2/aftercare/students");
    setStudents(res.data.data.students);
  };

  return (
    <FadeIn>
      Add Students
      <CheckAllBox />
      <div>
        {rows.map(({ Checkbox, original, checked, rowId }) => (
          <div key={rowId}>
            <Checkbox />
            {original.fullName} - {checked ? "True" : "False"}
          </div>
        ))}
      </div>
    </FadeIn>
  );
};
