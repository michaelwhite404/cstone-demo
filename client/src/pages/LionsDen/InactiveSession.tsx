import React, { useEffect, useState } from "react";
import { Label } from "@blueprintjs/core";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { StudentModel } from "../../../../src/types/models";
import FadeIn from "../../components/FadeIn";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import useChecker from "../../hooks/useChecker";
import { APIStudentsResponse } from "../../types/apiResponses";
import { useWindowSize } from "../../hooks";

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
  const { rows } = useChecker(students);
  const { ref, inView } = useInView({ threshold: 0 });
  const [width] = useWindowSize();

  useEffect(() => {
    getAftercareStudents();
  }, []);

  const getAftercareStudents = async () => {
    const res = await axios.get<APIStudentsResponse>("/api/v2/aftercare/students");
    setStudents(res.data.data.students);
  };

  return (
    <div>
      <FadeIn>
        <div ref={ref} className="flex align-center space-between">
          <div className="session-header">Add Students</div>
          <PrimaryButton>Add Drop Ins</PrimaryButton>
        </div>
        <div style={{ marginBottom: 50 }}>
          {rows.map(({ Checkbox, original, rowId }) => (
            <div key={rowId}>
              <Label style={{ marginBottom: 0, fontWeight: 500 }}>
                <Checkbox />
                {original.fullName}
              </Label>
            </div>
          ))}
        </div>
        <div
          style={{
            width: width > 991 ? "calc(100% - 281px)" : "100%",
            position: "fixed",
            bottom: 20,
            visibility: inView ? "hidden" : "visible",
            opacity: inView ? 0 : 1,
            transition: "visibility 500ms, opacity 0.5s ease",
            display: "flex",
            justifyContent: "center",
            // left: width > 991 ? 0 : undefined,
          }}
        >
          <PrimaryButton>Add Drop Ins</PrimaryButton>
        </div>
      </FadeIn>
    </div>
  );
};
