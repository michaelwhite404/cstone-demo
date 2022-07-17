import React from "react";
import { DepartmentModel } from "../../../../src/types/models";
import TableWrapper from "../../components/TableWrapper";

export default function DepartmentsTable({ departments }: { departments: DepartmentModel[] }) {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-4 sticky-header">Name</th>
            <th className="pl-4 sticky-header">Leaders</th>
            <th className="pl-4 sticky-header">Approvers</th>
            <th className="pl-4 sticky-header">Employees</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department._id}>
              <td className="pl-4">{department.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
