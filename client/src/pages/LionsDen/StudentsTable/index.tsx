import { Checkbox } from "@mui/material";
import { StudentModel } from "../../../../../src/types/models";
import TableWrapper from "../../../components/TableWrapper";
import { numberToGrade } from "../../../utils/grades";
import "./StudentsTable.sass";

export default function StudentTable({ students }: { students: StudentAftercareStat[] }) {
  const headings = [
    { comp: <Checkbox />, className: "sm:w-auto w-20" },
    { comp: "Student", className: "" },
    { comp: "Grade", className: "hidden sm:table-cell" },
    { comp: "Days Present", className: "hidden sm:table-cell" },
    { comp: "Days Late", className: "hidden sm:table-cell" },
  ];

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
          {students.map((student) => (
            <tr style={{ borderBottom: "1px #e5e7eb solid" }} key={student._id}>
              <td>
                <Checkbox />
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
