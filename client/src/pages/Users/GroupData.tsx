import { MailIcon as MailIconSolid } from "@heroicons/react/solid";
import { MailIcon as MailIconOutline, PencilIcon, SearchIcon } from "@heroicons/react/outline";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GroupMember, GroupModel } from "../../../../src/types/models";
import BackButton from "../../components/BackButton";
import { Button, Divider } from "@mui/material";
import { useChecker2, useToasterContext } from "../../hooks";
import classNames from "classnames";
import TableWrapper from "../../components/TableWrapper";
import GroupDataSlider from "./GroupDataSlider";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import GroupDataAdd from "./GroupDataAdd";
import { APIError, APIResponse } from "../../types/apiResponses";
import { admin_directory_v1 } from "googleapis";
import pluralize from "pluralize";
import capitalize from "capitalize";

export default function GroupData() {
  const [group, setGroup] = useState<GroupModel>();
  const { showToaster } = useToasterContext();
  const { slug } = useParams();
  const {
    setData: setMembers,
    allSelected,
    checkboxRef,
    toggleAll,
    selectedData: selectedMembers,
    data: members,
    setSelectedData: setSelectedMembers,
  } = useChecker2(group?.members === undefined ? [] : group.members);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const fetchGroup = useCallback(async () => {
    try {
      const res = await axios.get(`/api/v2/groups/${slug}`);
      setGroup(res.data.data.group);
      setMembers(res.data.data.group.members || []);
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  }, [setMembers, showToaster, slug]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const data = {
    name: group?.name || "",
    description: group?.description || "",
    email: group?.email || "",
    aliases: group?.aliases || [],
  };

  const addMembersToGroup = async (users: { name: string; email: string; role: string }[]) => {
    interface Res {
      members: admin_directory_v1.Schema$Member[];
    }
    axios
      .post<APIResponse<Res>>(`/api/v2/groups/${slug}/members`, { users })
      .then((res) => {
        const returnedMembers = res.data.data.members;
        // fetchGroup();
        const membersWithName: GroupMember[] = returnedMembers.map((member) => ({
          ...member,
          fullName: users.find((user) => user.email === member.email)!.name,
        }));
        setMembers(
          [...members, ...membersWithName].sort((a, b) => a.email!.localeCompare(b.email!))
        );
        showToaster(
          pluralize("members", returnedMembers.length, true) +
            " added. It might take some time for changes to be reflected.",
          "success"
        );
      })
      .catch(() => showToaster("There was a problem with the request. Please try again", "danger"));
  };

  const updateGroup = async (data: { name: string; description: string; email: string }) => {
    try {
      const res = await axios.patch(`/api/v2/groups/${slug}`, data);
      setGroup({ members, ...res.data.data.group });
      showToaster("Group Updated!", "success");
    } catch (err: any) {
      showToaster(err.response.data.message, "danger");
    }
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
                onClick={() => setOpenEdit(true)}
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
                <PrimaryButton text="+ Add Members" onClick={() => setOpenAdd(true)} />
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
                        ref={checkboxRef}
                        checked={allSelected && members.length > 0}
                        onChange={toggleAll}
                      />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Type</th>
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
                          {capitalize(member.role?.toLowerCase() || "")}
                        </td>
                        <td className="py-2.5 border-b border-gray-300 text-gray-400">
                          {capitalize(member.type?.toLowerCase() || "")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableWrapper>
            {/* Empty State */}
            {members.length === 0 && (
              <div>
                <div className="flex justify-center align-center text-slate-400 mt-10">
                  <img className="w-28 mr-10" src="../../empty_box.png" alt="Empty Box" />
                  This group doesn't have any members
                </div>
                <div className="text-center">
                  <Button style={{ fontFamily: "inherit" }} onClick={() => setOpenAdd(true)}>
                    + Add Members
                  </Button>
                  {/* <button className="text-blue-500 font-medium uppercase">Add Members</button> */}
                </div>
              </div>
            )}
            <GroupDataSlider
              open={openEdit}
              setOpen={setOpenEdit}
              data={data}
              updateGroup={updateGroup}
            />
            <GroupDataAdd
              open={openAdd}
              setOpen={setOpenAdd}
              groupName={group.name!}
              addMembersToGroup={addMembersToGroup}
            />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
