import { useState } from "react";
import axios, { AxiosError } from "axios";
import { StudentModel } from "../../../../src/types/models";
import EmptyPage from "./InactiveSession/EmptyPage";
import AddStudents from "./InactiveSession/AddStudents";
import AddDropIns from "./InactiveSession/AddDropsIns";
import { InactivePageState } from "../../types/aftercareTypes";
import { useToasterContext } from "../../hooks";
import { APICurrentSessionResponse, APIError } from "../../types/apiResponses";

export default function InactiveSession() {
  const [pageState, setPageState] = useState<InactivePageState>("empty");
  const [studentsToAdd, setStudentsToAdd] = useState<StudentModel[]>([]);
  const { showToaster } = useToasterContext();

  const startSession = async (students: string[]) => {
    try {
      const res = await axios.post<APICurrentSessionResponse>("/api/v2/aftercare/session", {
        students,
      });
      showToaster("Session Started", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const pages = [
    {
      state: "empty",
      Component: EmptyPage,
    },
    {
      state: "students",
      Component: AddStudents,
    },
    {
      state: "dropIns",
      Component: AddDropIns,
      props: {
        startSession,
      },
    },
  ];

  const { Component, props } = pages.find((page) => page.state === pageState)!;

  return (
    <Component
      setPageState={setPageState}
      setStudentsToAdd={setStudentsToAdd}
      studentsToAdd={studentsToAdd}
      {...props}
    />
  );
}
