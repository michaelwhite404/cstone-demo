import { CheckIcon, PlusIcon, XCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import capitalize from "capitalize";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { EmployeeModel } from "../../../../src/types/models";
import Combobox from "../../components/Combobox";
import Menu from "../../components/Menu";
import Modal from "../../components/Modal";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  departmentName: string;
  addMembersToGroup: (
    users: {
      name: string;
      email: string;
      role: string;
    }[]
  ) => Promise<void>;
}

type Role = "MEMBER" | "LEADER";

export default function AddDepartmentUserModal(props: Props) {
  const { open, setOpen, departmentName, addMembersToGroup } = props;
  const [users, setUsers] = useState<EmployeeModel[]>([]);
  const [memberToAdd, setMemberToAdd] = useState<{
    user?: EmployeeModel;
    role: Role;
  }>({ role: "MEMBER" });
  const [futureMembers, setFutureMembers] = useState<Required<typeof memberToAdd>[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("/api/v2/users?active=true");
      setUsers(res.data.data.users);
    };
    fetchUsers();
  }, []);

  const roleOptions = ["MEMBER", "LEADER"].map((role) => ({
    label: capitalize(role.toLowerCase()),
    value: role,
  }));

  const handleComboboxChange = (value?: EmployeeModel) =>
    value && setMemberToAdd({ ...memberToAdd, user: value });

  //@ts-ignore
  const handleRoleChange: (value: { label: string; value: string }) => void = ({
    value,
  }: {
    value: Role;
  }) => {
    setMemberToAdd({ ...memberToAdd, role: value });
  };

  const close = () => {
    setOpen(false);
    setMemberToAdd({ role: "MEMBER" });
    setFutureMembers([]);
  };

  const addMember = () => {
    if (memberToAdd.user && memberToAdd.role) {
      setUsers([...users].filter((user) => user.email !== memberToAdd.user?.email));
      setFutureMembers([{ user: memberToAdd.user, role: memberToAdd.role }, ...futureMembers]);
      setMemberToAdd({ role: "MEMBER" });
    }
  };

  const handleDelete = (email: string) =>
    setFutureMembers(futureMembers.filter((m) => m.user.email !== email));

  const submit = () => {
    const usersArg = futureMembers.map((fM) => ({
      name: fM.user.fullName!,
      email: fM.user.email!,
      role: fM.role,
    }));
    addMembersToGroup(usersArg).then(close);
  };

  const displayValue = (option?: EmployeeModel) => option?.fullName || "";

  return (
    <Modal open={open} setOpen={setOpen} disableOverlayClick onClose={close}>
      <div className="font-medium text-xl mb-5">Add Members</div>
      <div>
        <div className="mb-5">
          <div className="uppercase text-gray-400 text-xs font-medium mb-2">
            Add members to {departmentName} Department
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "1fr auto auto" }}>
            <div>
              <Combobox
                value={memberToAdd.user}
                options={users}
                displayValue={displayValue}
                filterFunction={(user, currentValue) =>
                  user.fullName!.toLowerCase().includes(currentValue.toLowerCase()) ||
                  user.email!.toLowerCase().includes(currentValue.toLowerCase())
                }
                onChange={handleComboboxChange}
                renderItem={(user, { active, selected }) => (
                  <>
                    <span className={classNames("block truncate", selected && "font-semibold")}>
                      {user.fullName}{" "}
                      <span
                        className={classNames("text-xs", active ? "text-white" : "text-gray-400")}
                      >
                        ({user.email})
                      </span>
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          active ? "text-white" : "text-blue-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <Menu options={roleOptions} onChange={handleRoleChange} />
            </div>
            <div>
              <button
                type="button"
                className="disabled:bg-gray-300 w-full inline-flex items-center justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                disabled={!memberToAdd.user}
                onClick={addMember}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="uppercase text-gray-400 text-xs font-medium mb-2">
            Members to Add ({futureMembers.length})
          </div>
          <div className="h-32 overflow-scroll">
            <div>
              {futureMembers.map((m) => (
                <div className="flex justify-between items-center py-2" key={m.user._id}>
                  <div>
                    <div className="font-medium">{m.user.fullName}</div>
                    <div className="font-light text-gray-400 text-xs">{m.user.email}</div>
                  </div>
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        {capitalize(m.role.toLowerCase())}
                      </div>
                    </div>
                    <div className="mx-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-red-400"
                        onClick={() => handleDelete(m.user.email!)}
                      >
                        <XCircleIcon className="w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="disabled:bg-gray-300 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={submit}
          disabled={futureMembers.length === 0}
        >
          Add to Group
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
