import { FilterIcon, SearchIcon } from "@heroicons/react/outline";
import { useOutletContext } from "react-router-dom";
import { EmployeeModel } from "../../../../src/types/models";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useDocTitle } from "../../hooks";
import UsersTable from "./UsersTable";

export default function Users() {
  useDocTitle("Users | Cornerstone App");
  const { users } = useOutletContext<{ users: EmployeeModel[] }>();

  return (
    <div className="flex-1 h-full">
      <div className="flex justify-between align-center">
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <SearchIcon className="w-4" />
          </div>
          <input
            type="search"
            id="search"
            className="block p-2 pl-10 w-64 text-sm text-gray-900 bg-white rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search"
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
  );
}
