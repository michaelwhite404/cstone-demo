import { useState } from "react";
import { StudentModel } from "../../../../src/types/models";
import EmptyPage from "./InactiveSession/EmptyPage";
import AddStudents from "./InactiveSession/AddStudents";
import AddDropIns from "./InactiveSession/AddDropsIns";
import { InactivePageState } from "../../types/aftercareTypes";

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
