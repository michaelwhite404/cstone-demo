import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { useTable } from "react-table";
import { StudentModel } from "../../../../src/types/models/studentTypes";
import { APIError, APIStudentsResponse } from "../../types/apiResponses";
import STUDENT_COLUMNS from "./StudentColumns";

export default function Students() {
  const [students, setStudents] = useState<StudentModel[]>([]);
  const columns = useMemo(() => STUDENT_COLUMNS, []);
  const data = useMemo(() => students, [students]);
  useEffect(() => {
    getStudents();

    async function getStudents() {
      try {
        const res = await axios.get<APIStudentsResponse>("/api/v2/students", {
          params: {
            sort: "grade,lastName",
            limit: 1000,
          },
        });
        setStudents(res.data.data.students);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, []);

  // @ts-ignore
  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps()}>
                    {
                      // Render the header
                      column.render("Header")
                    }
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {
          // Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    // Apply the cell props
                    return (
                      <td {...cell.getCellProps()}>
                        {
                          // Render the cell contents
                          cell.render("Cell")
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}
