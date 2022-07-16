import { FilterIcon, SearchIcon } from "@heroicons/react/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { EmployeeModel } from "../../../../src/types/models";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
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
        <div className="flex justify-between align-center">
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <SearchIcon className="w-4" />
            </div>
            <input
              type="search"
              id="search"
              className="block p-2 pl-10 w-full text-sm text-gray-900 bg-white rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              <FilterIcon className="mr-3 h-5 w-5 text-gray-400" />
              Filter
              <div className="w-5 h-5 rounded-full bg-blue-200 text-blue-600 flex align-center justify-center text-xs ml-3 border-blue-600 border">
                0
              </div>
            </button>
            <PrimaryButton text="+ Add User" />
          </div>
        </div>
        <UsersTable users={users} />
      </div>
    </div>
  );
}
