import { CheckIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { admin_directory_v1 } from "googleapis";
import { useEffect, useState } from "react";
import Combobox from "../../components/Combobox";
import Modal from "../../components/Modal";

interface GroupDataAddProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupName: string;
}

export default function GroupDataAdd(props: GroupDataAddProps) {
  const { open, setOpen } = props;
  const [googleUsers, setGoogleUsers] = useState<admin_directory_v1.Schema$User[]>([]);

  useEffect(() => {
    const fetchGoogleUsers = async () => {
      setGoogleUsers([]);
    };
    fetchGoogleUsers();
  }, []);

  const displayValue = (option?: { one: string }) => option?.one || "";

  return (
    <Modal open={open} setOpen={setOpen} disableOverlayClick>
      <div className="font-medium text-xl mb-5">Add Members</div>
      <div>
        <div className="mb-5">
          <div className="uppercase text-gray-400 text-xs font-medium mb-2">
            Add members to {props.groupName}
          </div>
          <div className="flex justify-between">
            <Combobox
              options={Array.from({ length: 50 }).map((_, i) => ({ one: i.toString() }))}
              displayValue={displayValue}
              filterFunction={(option, currentValue) =>
                option.one.toLowerCase().includes(currentValue.toLowerCase())
              }
              renderItem={(option, { active, selected }) => (
                <>
                  <span className={classNames("block truncate", selected && "font-semibold")}>
                    {option.one}
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
        </div>
        <div>
          <div className="uppercase text-gray-400 text-xs font-medium mb-2">Members to Add</div>
          <div className="h-32"></div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => setOpen(false)}
        >
          Add to Group
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
