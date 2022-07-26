import { SearchIcon } from "@heroicons/react/outline";
import axios from "axios";
import classNames from "classnames";
import { admin_directory_v1 } from "googleapis";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import TableWrapper from "../../components/TableWrapper";
import { APIResponse } from "../../types/apiResponses";
// import GroupsTable from "./GroupsTable";

export default function Groups() {
  const [groups, setGroups] = useState<admin_directory_v1.Schema$Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<admin_directory_v1.Schema$Group[]>([]);
  const checkbox = useRef<HTMLInputElement | null>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useEffect(() => {
    axios
      .get<APIResponse<{ groups: admin_directory_v1.Schema$Group[] }>>("/api/v2/groups")
      .then((res) =>
        setGroups(
          res.data.data.groups.sort((a, b) => {
            const nameA = a.name!.toUpperCase();
            const nameB = b.name!.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          })
        )
      );
  }, []);

  useLayoutEffect(() => {
    const isIndeterminate = selectedGroups.length > 0 && selectedGroups.length < groups.length;
    setChecked(selectedGroups.length === groups.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) checkbox.current.indeterminate = isIndeterminate;
  }, [groups.length, selectedGroups]);

  function toggleAll() {
    setSelectedGroups(checked || indeterminate ? [] : groups);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
    <div>
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
          <PrimaryButton text="+ Create Group" />
        </div>
      </div>
      <TableWrapper>
        <table>
          <thead>
            <tr>
              <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8 border-b">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                  ref={checkbox}
                  checked={groups.length > 0 && checked}
                  onChange={toggleAll}
                />
              </th>
              <th scope="col">Group Name</th>
              <th scope="col">Email Address</th>
              <th scope="col">Members</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const selected = selectedGroups.includes(group);
              return (
                <tr
                  className={classNames(
                    { "bg-indigo-50": selected },
                    { "hover:bg-gray-100": !selected }
                  )}
                  key={group.id}
                >
                  <td className="relative w-12 px-6 sm:w-16 sm:px-8 pl-4 py-2.5 border-b border-gray-300">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                      value={group.email!}
                      checked={selected}
                      onChange={(e) =>
                        setSelectedGroups(
                          e.target.checked
                            ? [...selectedGroups, group]
                            : selectedGroups.filter((g) => g !== group)
                        )
                      }
                    />
                  </td>
                  <td className="py-2.5 border-b border-gray-300">
                    <Link to={`/users/groups/${group.email!.split("@")[0]}`}>
                      <span className="text-blue-500 font-medium">{group.name}</span>
                    </Link>
                  </td>
                  <td className="py-2.5 border-b border-gray-300 text-gray-400">{group.email}</td>
                  <td className="py-2.5 border-b border-gray-300 text-gray-400">
                    {group.directMembersCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrapper>
    </div>
  );
}
