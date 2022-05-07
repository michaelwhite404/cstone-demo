import React, { useEffect, useState } from "react";
import { Button, Icon, Label } from "@blueprintjs/core";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { StudentModel } from "../../../../src/types/models";
import FadeIn from "../../components/FadeIn";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import useChecker from "../../hooks/useChecker";
import { APIStudentsResponse } from "../../types/apiResponses";
import { useWindowSize } from "../../hooks";
import Select, { ActionMeta } from "react-select";

type InactivePageState = "empty" | "students" | "dropIns";

export default function InactiveSession() {
  const [pageState, setPageState] = useState<InactivePageState>("empty");
  const [studentsToAdd, setStudentsToAdd] = useState<StudentModel[]>([]);

  const pages = [
    { state: "empty", Component: EmptyPage },
    { state: "students", Component: AddStudents },
    { state: "dropIns", Component: AddDropIns },
  ];

  const { Component } = pages.find((page) => page.state === pageState)!;

  return <Component setPageState={setPageState} setStudentsToAdd={setStudentsToAdd} />;
}

interface PagesProps {
  setPageState: React.Dispatch<React.SetStateAction<InactivePageState>>;
  setStudentsToAdd: React.Dispatch<React.SetStateAction<StudentModel[]>>;
}

const EmptyPage = ({ setPageState, setStudentsToAdd }: PagesProps) => (
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

const AddStudents = ({ setPageState, setStudentsToAdd }: PagesProps) => {
  const [students, setStudents] = useState<StudentModel[]>([]);
  const { rows } = useChecker(students, setStudentsToAdd);
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
          <PrimaryButton onClick={() => setPageState("dropIns")}>Add Drop Ins</PrimaryButton>
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
      </FadeIn>
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
        <PrimaryButton onClick={() => setPageState("dropIns")}>Add Drop Ins</PrimaryButton>
      </div>
    </div>
  );
};

interface StudentToSelect {
  student: StudentModel;
  selected: boolean;
}

interface Option {
  label: string;
  value: string;
}

const AddDropIns = ({ setPageState, setStudentsToAdd }: PagesProps) => {
  const [students, setStudents] = useState<StudentToSelect[]>([]);
  useEffect(() => {
    getAftercareStudents();
  }, []);

  const getAftercareStudents = async () => {
    const res = await axios.get<APIStudentsResponse>("/api/v2/students", {
      params: {
        status: "Active",
        sort: "-grade,lastName",
        limit: 2000,
      },
    });
    const stu = res.data.data.students
      .filter((s) => !s.aftercare)
      .map((s) => ({ student: s, selected: false }));
    setStudents(stu);
  };

  const options = students
    .filter((s) => !s.selected)
    .map(({ student }) => ({ label: student.fullName, value: student._id }));

  const handleSelect = (_: readonly Option[], meta: ActionMeta<Option>) => {
    if (meta.action === "pop-value") return;
    const index = students.findIndex((data) => data.student._id === meta.option?.value);
    if (index > -1) {
      const copyStudents = [...students];
      copyStudents[index].selected = true;
      setStudents(copyStudents);
    }
  };

  const handleDelete = (id: string) => {
    const index = students.findIndex(({ student }) => student._id === id);
    if (index > -1) {
      const copy = [...students];
      copy[index].selected = false;
      setStudents(copy);
    }
  };

  const StudentRow = ({ student }: { student: StudentModel }) => (
    <div className="flex align-center" style={{ padding: 10, paddingLeft: 0 }}>
      <Button onClick={() => handleDelete(student._id)}>
        <Icon icon="trash" color="#ca1b1b" />
      </Button>
      <div style={{ marginLeft: 10, fontWeight: 500 }}>{student.fullName}</div>
    </div>
  );

  return (
    <FadeIn>
      <div className="session-header">Add Drop Ins</div>
      <div className="add-student-container">
        <Select
          isMulti
          options={options}
          value={[] as Option[]}
          onChange={handleSelect}
          placeholder="Students to Add"
        />
        <PrimaryButton>✓ &nbsp;&nbsp; Start Session</PrimaryButton>
      </div>
      <div style={{ marginTop: 10 }}>
        {students
          .filter((s) => s.selected)
          .map(({ student }) => (
            <StudentRow key={student._id} student={student} />
          ))}
      </div>
    </FadeIn>
  );
};
