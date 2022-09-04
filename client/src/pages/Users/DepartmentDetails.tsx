import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DepartmentModel } from "../../../../src/types/models";
import BackButton from "../../components/BackButton";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useToasterContext } from "../../hooks";
import AddDepartmentUserModal from "./AddDepartmentUserModal";
import DepartmentMembersTable from "./DepartmentMembersTable";

export default function DepartmentDetails() {
  const [department, setDepartment] = useState<DepartmentModel>();
  const [open, setOpen] = useState(false);
  const { id } = useParams<"id">();
  const { showToaster } = useToasterContext();
  useEffect(() => {
    const fetchDepartment = async () => {
      const res = await axios.get(`/api/v2/departments/${id}`);
      setDepartment(res.data.data.department);
    };

    fetchDepartment();
  }, [id]);

  const addMembersToGroup = async (users: { name: string; email: string; role: string }[]) => {
    // interface Res {
    //   members: admin_directory_v1.Schema$Member[];
    // }
    // axios
    //   .post<APIResponse<Res>>(`/api/v2/groups/${slug}/members`, { users })
    //   .then((res) => {
    //     const returnedMembers = res.data.data.members;
    //     // fetchGroup();
    //     const membersWithName: GroupMember[] = returnedMembers.map((member) => ({
    //       ...member,
    //       fullName: users.find((user) => user.email === member.email)!.name,
    //     }));
    //     setM([...members, ...membersWithName].sort((a, b) => a.email!.localeCompare(b.email!)));
    //     showToaster(
    //       pluralize("members", returnedMembers.length, true) +
    //         " added. It might take some time for changes to be reflected.",
    //       "success"
    //     );
    //   })
    //   .catch(() => showToaster("There was a problem with the request. Please try again", "danger"));
    showToaster("Not implemented yet", "danger");
  };

  return (
    <div className="flex flex-col" style={{ padding: "10px 25px 25px" }}>
      <div className="my-4 hover:underline cursor-pointer">
        <BackButton />
        Back to departments
      </div>
      {department && (
        <div>
          <div className="mb-5">
            <h1>{department?.name}</h1>
          </div>
          <div>
            <h2>Settings</h2>
            <div>Can accept tickets</div>
          </div>
          <div>
            <div className="flex justify-between">
              <h2>Members</h2>
              <PrimaryButton
                className="w-full sm:w-auto"
                text="+ Add Members"
                onClick={() => setOpen(true)}
              />
            </div>
            <DepartmentMembersTable department={department} />
          </div>
          <AddDepartmentUserModal
            open={open}
            setOpen={setOpen}
            departmentName={department.name}
            addMembersToGroup={addMembersToGroup}
          />
        </div>
      )}
    </div>
  );
}
