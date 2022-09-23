import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { EmployeeModel } from "../../../../../src/types/models";
import MainContent from "../../../components/MainContent";
import PageHeader from "../../../components/PageHeader";
import SideTable from "../../../components/SideTable/SideTable";
import { useWindowSize } from "../../../hooks";
import { APIUsersResponse } from "../../../types/apiResponses";
import UserPage from "./UserPage";

export default function Admin() {
  const [viewState, setViewState] = useState("blank");
  const [users, setUsers] = useState<EmployeeModel[]>([]);
  const [selected, setSelected] = useState<EmployeeModel>();
  const width = useWindowSize()[0];

  useEffect(() => {
    const getTimesheetUsers = async () => {
      const res = await axios.get<APIUsersResponse>("/api/v2/users", {
        params: { timesheetEnabled: true },
      });
      setUsers(res.data.data.users);
    };
    getTimesheetUsers();
  }, []);

  const data = useMemo(() => users, [users]);
  const columns = useMemo(
    () => [
      { Header: "Full Name", accessor: "fullName" },
      { Header: "First Name", accessor: "firstName" },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      { Header: "Email", accessor: "email" },
      { Header: "Timesheet Enabled", accessor: "timesheetEnabled" },
      { Header: "Image", accessor: (original: any): string => original.image || "" },
      {
        Header: "First Letter",
        id: "firstLetter",
        accessor: ({ lastName }: { lastName: string }) => lastName[0].toUpperCase(),
      },
    ],
    []
  );

  const handleBack = () => {
    setViewState("blank");
    setSelected(undefined);
  };

  const handleSelection = (user: EmployeeModel) => {
    setSelected(user);
    setViewState("timesheet");
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {!(width < 768 && viewState !== "blank") && (
        <SideTable
          columns={columns}
          data={data}
          rowComponent={RowComponent}
          groupBy="firstLetter"
          onSelectionChange={handleSelection}
          selected={selected?._id || ""}
        >
          <div className="side-table-top">
            <PageHeader text="Timesheets" />
          </div>
        </SideTable>
      )}
      <MainContent>
        {viewState === "timesheet" && selected && (
          <UserPage onBack={handleBack} selected={selected} />
        )}
      </MainContent>
    </div>
  );
}

const RowComponent = (user: EmployeeModel) => {
  return (
    <div className="relative flex items-center space-x-3 px-6 py-5">
      <div className="flex-shrink-0">
        <img className="h-10 w-10 rounded-full" src={user.image} alt="" />
      </div>
      <div className="min-w-0 flex-1">
        <button className="focus:outline-none text-left">
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="m-0 text-sm font-medium text-gray-900">{user.fullName}</p>
          <p className="m-0 truncate text-sm text-gray-500">{user.title}</p>
        </button>
      </div>
    </div>
  );
};
