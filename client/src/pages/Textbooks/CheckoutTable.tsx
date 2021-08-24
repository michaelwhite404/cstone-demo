import { HTMLSelect } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { TextbookModel } from "../../../../src/types/models/textbookTypes";
import { APIError } from "../../types/apiResponses";

interface Grades {
  count: number;
  students: { id: string; fullName: string }[];
  grade: number;
}

const gradeValues = Array.from({ length: 13 }).map((_, i) => ({
  value: `${i}`,
  label: i === 0 ? "Kindergarten" : `${i}`,
}));
gradeValues.unshift({ value: "-1", label: "Select a grade" });

export default function CheckoutTable({ data }: { data: TextbookModel[] }) {
  const [grades, setGrades] = useState<Grades[]>([]);
  const [checkoutData, setCheckoutData] = useState<{ id: string; student: string | null }[]>(
    data.map((t) => ({ id: t._id, student: null }))
  );

  const submittable = checkoutData.filter((row) => row.student === null).length === 0;

  const updateBookData = (id: string, student: string | null) => {
    const data = [...checkoutData];
    const index = data.findIndex((book) => book.id === id);
    if (index > -1) {
      data[index] = { id, student };
      setCheckoutData(data);
    }
  };

  useEffect(() => {
    getStudents();

    async function getStudents() {
      try {
        const res = await axios.get("/api/v2/students/group");
        setGrades(res.data.data.grades);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, []);

  return (
    <>
      <table style={{ width: 600 }}>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Number</th>
            <th>Grade</th>
            <th>Student</th>
          </tr>
        </thead>
        <tbody>
          {data.map((t) => (
            <CheckoutTableRow textbook={t} grades={grades} updateBookData={updateBookData} />
          ))}
        </tbody>
      </table>
      {submittable && <button>Check Out</button>}
    </>
  );
}

function CheckoutTableRow({
  textbook,
  grades,
  updateBookData,
}: {
  textbook: TextbookModel;
  grades: Grades[];
  updateBookData: (id: string, student: string | null) => void;
}) {
  const [gradePicked, setGradePicked] = useState<number | null>(null);
  const ref = useRef(null);
  const studentOptions =
    gradePicked === null
      ? undefined
      : grades[gradePicked].students.map((s) => ({
          label: s.fullName,
          value: s.id,
        }));
  studentOptions?.unshift({ label: "Select A Student", value: "-1" });
  return (
    <tr>
      <td>{textbook.textbookSet.title}</td>
      <td>{textbook.bookNumber}</td>
      <td>
        <HTMLSelect
          options={gradeValues}
          ref={ref}
          onChange={(e) => {
            setGradePicked(e.target.value === "-1" ? null : +e.target.value);
            updateBookData(textbook._id, null);
          }}
        />
      </td>
      <td>
        {gradePicked !== null && (
          <HTMLSelect
            options={studentOptions}
            ref={ref}
            onChange={(e) =>
              updateBookData(textbook._id, e.target.value === "-1" ? null : e.target.value)
            }
          />
        )}
      </td>
    </tr>
  );
}
