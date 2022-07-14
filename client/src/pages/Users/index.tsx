import axios from "axios";
import React, { useEffect, useState } from "react";
import { EmployeeModel } from "../../../../src/types/models";
import Tabs from "../../components/Tabs";
import UsersTable from "./UsersTable";

const tabs = [
  { title: "Users", name: "users", href: "" },
  { title: "Departments", name: "departments", href: "/departments" },
  { title: "Groups", name: "groups", href: "/groups" },
];

export default function Users() {
  const [users, setUsers] = useState<EmployeeModel[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("/api/v2/users", {
        params: {
          sort: "-active,lastName",
        },
      });
      setUsers(res.data.data.users);
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col" style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Users</h1>
        <p>Manage the team and account permissions here</p>
      </div>
      <div className="my-4">
        <Tabs>
          <Tabs.Tab current>Users</Tabs.Tab>
          <Tabs.Tab>Departments</Tabs.Tab>
          <Tabs.Tab>Groups</Tabs.Tab>
        </Tabs>
      </div>
      <div className="flex-1 h-full">
        <UsersTable users={users} />
      </div>
    </div>
  );
}
