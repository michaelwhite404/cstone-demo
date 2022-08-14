import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { StudentModel } from "../../../../src/types/models";
import { useToasterContext } from "../../hooks";
import { APIStudentResponse } from "../../types/apiResponses";

export default function StudentDetails() {
  const location = useLocation();
  const [student, setStudent] = useState<StudentModel | undefined>(() =>
    (location.state as any)?.newStudent
      ? (location.state as { newStudent: true; student: StudentModel }).student
      : undefined
  );
  const { slug } = useParams<{ slug: string }>();
  const { showToaster } = useToasterContext();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get<APIStudentResponse>(`/api/v2/students/${slug}`);
        setStudent(res.data.data.student);
        console.log("FETCHED");
      } catch (err) {
        showToaster("Could not fetch student. Plese try again", "danger");
      }
    };

    (location.state as any)?.newStudent
      ? window.history.replaceState({}, document.title)
      : fetchStudent();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <div>
      StudentDetails
      {JSON.stringify(student)}
    </div>
  );
}
