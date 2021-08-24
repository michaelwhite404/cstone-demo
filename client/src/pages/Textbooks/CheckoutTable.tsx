import { HTMLSelect } from "@blueprintjs/core";
import { CheckCircleIcon } from "@heroicons/react/solid";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { TextbookModel } from "../../../../src/types/models/textbookTypes";
import TableToolbox from "../../components/Table/TableToolbox";
import { APIError } from "../../types/apiResponses";
import { grades } from "../../utils/grades";
import "./Table.sass";

interface Grades {
  count: number;
  students: { id: string; fullName: string }[];
  grade: number;
}

const gradeValues = grades.map((value, i) => ({
  value: `${i}`,
  label: i === 0 ? "Kindergarten" : value,
}));
gradeValues.unshift({ value: "-1", label: "Select a grade" });

export default function CheckoutTable({ data }: { data: TextbookModel[] }) {
  const [grades, setGrades] = useState<Grades[]>([]);
  const [checkoutData, setCheckoutData] = useState<{ id: string; student: string | null }[]>(
    data.map((t) => ({ id: t._id, student: null }))
  );
  const [gradeSelect, setGradeSelect] = useState(checkoutData.map(() => -1));

  const submittable = checkoutData.filter((row) => row.student === null).length === 0;

  const updateBookData = (id: string, student: string | null) => {
    const data = [...checkoutData];
    const index = data.findIndex((book) => book.id === id);
    if (index > -1) {
      data[index] = { id, student };
      setCheckoutData(data);
    }
  };

  const changeAllGrades = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const arr = Array(grades.length).fill(+e.target.value);
    setGradeSelect(arr);
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
      <TableToolbox>
        <span style={{ marginLeft: "25px" }}>
          Change All Grades: {"  "}
          <HTMLSelect options={gradeValues} onChange={changeAllGrades} />
        </span>
      </TableToolbox>
      <div className="checkout-container">
        <div
          style={{
            width: "100%",
            overflow: "scroll",
          }}
        >
          <table style={{ width: "100%" }} id="textbook-checkout-table">
            <colgroup>
              <col span={1} style={{ width: "8%" }} />
              <col span={1} style={{ width: "23%" }} />
              <col span={1} style={{ width: "23%" }} />
              <col span={1} style={{ width: "23%" }} />
              <col span={1} style={{ width: "23%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="sticky-header"></th>
                <th className="sticky-header">Book Name</th>
                <th className="sticky-header">Number</th>
                <th className="sticky-header">Grade</th>
                <th className="sticky-header">Student</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t, i) => (
                <CheckoutTableRow
                  textbook={t}
                  grades={grades}
                  updateBookData={updateBookData}
                  gradeSelect={gradeSelect}
                  setGradeSelect={setGradeSelect}
                  index={i}
                  currentValue={checkoutData[i]}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        style={{
          justifyContent: "end",
          minHeight: "40px",
          boxShadow: "0 -1px 0 rgba(16, 22, 26, 0.15)",
          marginTop: "auto",
          backgroundColor: "white",
          zIndex: 1,
        }}
      ></div>
      {/* {submittable && <button>Check Out</button>} */}
    </>
  );
}

function CheckoutTableRow({
  textbook,
  grades,
  updateBookData,
  gradeSelect,
  setGradeSelect,
  index,
  currentValue,
}: {
  textbook: TextbookModel;
  grades: Grades[];
  updateBookData: (id: string, student: string | null) => void;
  gradeSelect: number[];
  setGradeSelect: React.Dispatch<React.SetStateAction<number[]>>;
  index: number;
  currentValue: {
    id: string;
    student: string | null;
  };
}) {
  const studentOptions =
    gradeSelect[index] === -1
      ? undefined
      : grades[gradeSelect[index]].students.map((s) => ({
          label: s.fullName,
          value: s.id,
        }));
  studentOptions?.unshift({ label: "Select A Student", value: "-1" });

  const changeGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const grades = [...gradeSelect];
    grades[index] = +e.target.value;
    setGradeSelect(grades);
    updateBookData(textbook._id, null);
  };

  return (
    <tr>
      <td>
        <span
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {currentValue.student !== null && <CheckCircleIcon color="#2cc65f" width={25} />}
        </span>
      </td>
      <td>{textbook.textbookSet.title}</td>
      <td>{textbook.bookNumber}</td>
      <td>
        <HTMLSelect options={gradeValues} value={gradeSelect[index]} onChange={changeGrade} />
      </td>
      <td>
        {gradeSelect[index] !== -1 && (
          <HTMLSelect
            options={studentOptions}
            onChange={(e) =>
              updateBookData(textbook._id, e.target.value === "-1" ? null : e.target.value)
            }
          />
        )}
      </td>
    </tr>
  );
}
