import { DepartmentModel, EmployeeModel } from "../../../../src/types/models";
import AvatarList from "../../components/AvatarList";
import TableWrapper from "../../components/TableWrapper";

export default function DepartmentsTable({ departments }: { departments: DepartmentModel[] }) {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-4 sticky-header">Name</th>
            <th className="sticky-header">Leaders</th>
            <th className="sticky-header">Approvers</th>
            <th className="sticky-header">Employees</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department._id}>
              <td className="pl-4 py-1.5">{department.name}</td>
              <td className="py-1.5">
                <AvatarList users={getUsers(department, "leaders")} />
              </td>
              <td className="py-1.5">
                <AvatarList users={getUsers(department, "approvers")} />
              </td>
              <td className="py-1.5">
                <AvatarList users={getUsers(department, "employees")} max={6} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

const getUsers = (department: DepartmentModel, role: "leaders" | "approvers" | "employees") =>
  (department[role] as EmployeeModel[]).map((user) => ({ name: user.fullName, src: user.image }));
