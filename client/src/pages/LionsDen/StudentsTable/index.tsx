import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { StudentModel } from "../../../../../src/types/models";
import TableWrapper from "../../../components/TableWrapper";
import { numberToGrade } from "../../../utils/grades";
import "./StudentsTable.sass";

type RemoveArray<T> = T extends any[] ? T[number] : never;
type CheckboxStates = "unchecked" | "checked" | "indeterminate";

export default function StudentTable({ students }: { students: StudentAftercareStat[] }) {
  const [rows, setRows] = useState(students.map((s) => ({ ...s, checked: false })));
  const [main, setMain] = useState<CheckboxStates>("unchecked");

  const mainCheckboxClick = () => {
    if (main === "checked") {
      switchAll(false);
      return setMain("unchecked");
    }
    switchAll(true);
    setMain("checked");
  };
  const headings = [
    {
      comp: (
        <Checkbox
          onClick={mainCheckboxClick}
          indeterminate={main === "indeterminate"}
          checked={main === "checked"}
        />
      ),
      className: "sm:w-auto w-20",
    },
    { comp: "Student", className: "" },
    { comp: "Grade", className: "hidden sm:table-cell" },
    { comp: "Days Present", className: "hidden sm:table-cell" },
    { comp: "Late Pickup", className: "hidden sm:table-cell" },
  ];

  useEffect(() => {
    setRows(students.map((s) => ({ ...s, checked: false })));
  }, [students]);

  useEffect(() => {
    const numChecked = rows.filter((r) => r.checked).length;
    if (numChecked === 0) return setMain("unchecked");
    if (numChecked === rows.length) return setMain("checked");
    setMain("indeterminate");
  }, [rows]);

  const onCheckboxChange = (row: RemoveArray<typeof rows>) => {
    const copiedRows = [...rows];
    const findIndex = copiedRows.findIndex((r) => r._id === row._id);
    rows[findIndex].checked = !rows[findIndex].checked;
    setRows(copiedRows);
  };

  const switchAll = (checked: boolean) => setRows([...rows].map((row) => ({ ...row, checked })));

  return (
    <TableWrapper>
      <table className="aftercare-student-table">
        <thead>
          <tr>
            {headings.map((h) => (
              <th className={h.className}>{h.comp}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((student) => (
            <tr style={{ borderBottom: "1px #e5e7eb solid" }} key={student._id}>
              <td>
                <Checkbox checked={student.checked} onChange={() => onCheckboxChange(student)} />
              </td>
              <td>
                {student.fullName}
                <div className="block sm:hidden sub-td">
                  {student.grade !== undefined && <div>Grade: {numberToGrade(student.grade)}</div>}
                  {/* <div>Days Present: {student.entriesCount}</div>
                  <div>Days Late: {student.lateCount}</div> */}
                </div>
              </td>
              <td className="hidden sm:table-cell">
                {student.grade === undefined ? "" : numberToGrade(student.grade)}
              </td>
              <td className="hidden sm:table-cell">{student.entriesCount}</td>
              <td className="hidden sm:table-cell">{student.lateCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

interface StudentAftercareStat extends StudentModel {
  entriesCount: number;
  lateCount: number;
}
