import { MailIcon as MailIconSolid } from "@heroicons/react/solid";
import { MailIcon as MailIconOutline, PencilIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GroupModel } from "../../../../src/types/models";
import BackButton from "../../components/BackButton";
import { Divider } from "@mui/material";
import { useChecker2 } from "../../hooks";
import classNames from "classnames";
import TableWrapper from "../../components/TableWrapper";
import GroupDataSlider from "./GroupDataSlider";

export default function GroupData() {
  const [group, setGroup] = useState<GroupModel>();
  const { slug } = useParams();
  const {
    setData: setMembers,
    allSelected,
    checkboxRef,
    toggleAll,
    selectedData: selectedMembers,
    data: members,
    setSelectedData: setSelectedMembers,
  } = useChecker2(group?.members || []);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`/api/v2/groups/${slug}`);
        setGroup(res.data.data.group);
        setMembers(res.data.data.group.members);
      } catch (err) {}
    };

    fetchGroup();
  }, [setMembers, slug]);

  const data = {
    name: group?.name || "",
    description: group?.description || "",
    email: group?.email || "",
    aliases: group?.aliases || [],
  };

  return (
    <div className="flex flex-col" style={{ padding: "10px 25px 25px" }}>
      <div className="my-4 hover:underline cursor-pointer">
        <BackButton />
        Back to groups
      </div>
      {group ? (
        <>
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="mb-5">
                <h1 className="mb-1">{group?.name}</h1>
                <div className="italic">{group?.description || "No description"}</div>
              </div>
              <div>
                <div>
                  <div className="font-medium mb-1 text-gray-600">Email</div>
                  <div className="flex text-gray-400">
                    <MailIconSolid className="w-5 items-center mr-2" />
                    <span>{group?.email}</span>
                  </div>
                </div>
                {group?.aliases?.map((alias) => (
                  <div className="mt-3" key={alias}>
                    <div className="font-medium mb-1 text-gray-600">Alias</div>
                    <div className="flex text-gray-400">
                      <MailIconOutline className="w-5 text-gray-400 mr-2" />
                      <span>{alias}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 w-64 flex align-start justify-end">
              <button
                className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                onClick={() => setOpen(true)}
              >
                <PencilIcon className="w-4 mr-1.5" />
                Edit Group Details
              </button>
            </div>
          </div>
          <div className="py-10 px-20">
            <Divider />
          </div>
          <div>
            <TableWrapper>
              <table>
                <thead>
                  <tr>
                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8 border-b">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                        ref={checkboxRef}
                        checked={allSelected}
                        onChange={toggleAll}
                      />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const selected = selectedMembers.includes(member);
                    return (
                      <tr
                        className={classNames(
                          { "bg-indigo-50": selected },
                          { "hover:bg-gray-100": !selected }
                        )}
                        key={member.id}
                      >
                        <td className="relative w-12 px-6 sm:w-16 sm:px-8 pl-4 py-2.5 border-b border-gray-300">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                            value={member.id!}
                            checked={selected}
                            onChange={(e) =>
                              setSelectedMembers(
                                e.target.checked
                                  ? [...selectedMembers, member]
                                  : selectedMembers.filter((m) => m !== member)
                              )
                            }
                          />
                        </td>
                        <td className="py-2.5 border-b border-gray-300">
                          <Link to={``}>
                            <span className="text-blue-500 font-medium">{member.fullName}</span>
                          </Link>
                        </td>
                        <td className="py-2.5 border-b border-gray-300 text-gray-400">
                          {member.email}
                        </td>
                        <td className="py-2.5 border-b border-gray-300 text-gray-400">
                          {member.type}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableWrapper>
            <GroupDataSlider open={open} setOpen={setOpen} data={data} />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
