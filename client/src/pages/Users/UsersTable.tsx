import React from "react";
import { EmployeeModel } from "../../../../src/types/models";
import TableWrapper from "../../components/TableWrapper";

export default function UsersTable(props: UsersTableProps) {
  const { users } = props;

  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th colSpan={2} className="pl-4 sticky-header">
              Name
            </th>
            <th className="sticky-header">Email</th>
            <th className="sticky-header">Title</th>
            <th className="sticky-header">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="pl-4 py-1.5 border-b">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={`${user.image || "./avatar_placeholder.png"}`} alt={user.fullName} />
                </div>
              </td>
              <td className="border-b text-gray-400">
                <span className="text-blue-500 font-medium">{user.fullName}</span>
              </td>
              <td className="border-b text-gray-400">{user.email}</td>
              <td className="border-b text-gray-400">{user.title}</td>
              <td className="border-b text-gray-400">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

interface UsersTableProps {
  users: EmployeeModel[];
}
