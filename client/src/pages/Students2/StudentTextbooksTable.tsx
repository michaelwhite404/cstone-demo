import React from "react";
import { StudentTextbook } from "../../../../src/types/models";
import TableWrapper from "../../components/TableWrapper";

interface Props {
  textbooks: StudentTextbook[];
}

export default function StudentTextbooksTable({ textbooks }: Props) {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-4 ">Title</th>
            <th>#</th>
            <th>Class</th>
            <th>Quality</th>
          </tr>
        </thead>
        <tbody>
          {textbooks.map((textbook) => (
            <tr key={textbook._id}>
              <td className="pl-4 pr-6 py-2.5 font-medium w-[1%] whitespace-nowrap">
                {textbook.textbookSet.title}
              </td>
              <td>{textbook.bookNumber}</td>
              <td>{textbook.textbookSet.class}</td>
              <td>{textbook.quality}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
