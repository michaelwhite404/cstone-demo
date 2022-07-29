import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { Divider, Switch } from "@mui/material";
import classNames from "classnames";
import { Fragment, ReactNode, useState } from "react";
import { AddOnInput } from "../../components/Inputs";
import { grades } from "../../utils/grades";

interface AddUserProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
type ValueOf<T> = T[keyof T];

const settings = [
  {
    name: "Automatically generate a password",
    description: "You'll be able to view and copy the password in the next step",
    value: "autogenerate",
  },
  {
    name: "Create Password",
    description: "",
    value: "custom",
  },
];

export default function AddUser(props: AddUserProps) {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "@cornerstone-schools.org",
    title: "",
    homeroomGrade: "" as string | number,
    role: "",
    timesheetEnabled: false,
    password: "",
    changePasswordAtNextLogin: true,
  });
  const [selected, setSelected] = useState(settings[0].value);
  const [formErrors, setFormErrors] = useState({
    firstName: { valid: true, message: "" },
    lastName: { valid: true, message: "" },
    email: { valid: true, message: "" },
    title: { valid: true, message: "" },
  });

  const handleErrorChange = (key: keyof typeof formErrors, value: ValueOf<typeof formErrors>) =>
    setFormErrors((formErrors) => ({ ...formErrors, [key]: value }));

  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case "firstName":
      case "lastName":
      case "title":
        const set =
          value.length === 0
            ? { valid: false, message: "Value cannnot be empty" }
            : { valid: true, message: "" };
        handleErrorChange(fieldName, set);
        break;
      case "email":
        if (value.split("@")[0].length === 0) {
          handleErrorChange(fieldName, {
            valid: false,
            message: "Email address cannot be empty",
          });
          break;
        }
        const valid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? true : false;
        const message = valid ? "" : "Email address must be valid";
        handleErrorChange(fieldName, { valid, message });
        break;
      default:
        break;
    }
  };

  const close = () => props.setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    if (name === "email") value = value + "@cornerstone-schools.org";
    validateField(name, value);
    setUser({ ...user, [name]: value });
  };

  const submittable =
    user.firstName &&
    user.lastName &&
    user.email &&
    user.title &&
    user.role &&
    //@ts-ignore
    Object.keys(formErrors).every((key) => formErrors[key].valid === true) &&
    selected === "custom"
      ? user.password.length >= 8
      : true;

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={close}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="text-white px-6 pt-4 pb-2 bg-blue-600">
                  <span className="font-medium text-xl">Add User</span>
                  <p className="mt-1">Enter the information below to create a new user.</p>
                </div>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid gap-y-2 gap-x-6 sm:grid-cols-2 grid-cols-1">
                    <div>
                      <TextInput
                        label="First Name"
                        error={!formErrors.firstName.valid}
                        errorMessage={formErrors.firstName.message}
                        onChange={handleChange}
                        value={user.firstName}
                        name="firstName"
                      />
                    </div>
                    <div>
                      <TextInput
                        label="Last Name"
                        error={!formErrors.lastName.valid}
                        errorMessage={formErrors.lastName.message}
                        onChange={handleChange}
                        value={user.lastName}
                        name="lastName"
                      />
                    </div>
                    <div className="sm:col-span-2 col-span-1">
                      <AddOnInput
                        addOnText="@cornerstone-schools.org"
                        name="email"
                        id="email"
                        label="Email"
                        addOnSide="right"
                        onChange={handleChange}
                        value={user.email.split("@")[0]}
                        error={!formErrors.email.valid}
                      />
                      <ErrorMessage>{formErrors.email.message}</ErrorMessage>
                    </div>
                    <div className="sm:col-span-2 col-span-1">
                      <TextInput
                        label="Title"
                        error={!formErrors.title.valid}
                        errorMessage={formErrors.title.message}
                        onChange={handleChange}
                        value={user.title}
                        name="title"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        name="role"
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={user.role}
                        onChange={handleChange}
                      >
                        <option value="">Select A Role...</option>
                        <option>Super Admin</option>
                        <option>Admin</option>
                        <option>Development</option>
                        <option>Instructor</option>
                        <option>Maintenance</option>
                        <option>Intern</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="homeroomGrade"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Homeroom Grade
                      </label>
                      <select
                        name="homeroomGrade"
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={user.homeroomGrade}
                        onChange={handleChange}
                      >
                        <option value="">None</option>
                        {grades.map((value, i) => (
                          <option key={value} value={i}>
                            {i === 0 ? "Kindergarten" : `${value} Grade`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center sm:col-span-2 col-span-1 mt-2">
                      <label
                        htmlFor="timesheetEnabled"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Enable Timesheet
                      </label>
                      <Switch
                        checked={user.timesheetEnabled}
                        onChange={(_, checked) => setUser({ ...user, timesheetEnabled: checked })}
                      />
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="pt-4 pb-6 px-6">
                    <Divider />
                  </div>
                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Password</label> */}
                    <RadioGroup value={selected} onChange={setSelected}>
                      <RadioGroup.Label className="sr-only">Password</RadioGroup.Label>
                      <div className="bg-white rounded-md -space-y-px">
                        {settings.map((setting, settingIdx) => (
                          <RadioGroup.Option
                            key={setting.name}
                            value={setting.value}
                            className={({ checked }) =>
                              classNames(
                                settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                                settingIdx === settings.length - 1
                                  ? "rounded-bl-md rounded-br-md"
                                  : "",
                                checked ? "bg-blue-50 border-blue-200 z-10" : "border-gray-200",
                                "relative border p-4 flex cursor-pointer focus:outline-none"
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span
                                  className={classNames(
                                    checked
                                      ? "bg-blue-600 border-transparent"
                                      : "bg-white border-gray-300",
                                    active ? "ring-2 ring-offset-2 ring-blue-500" : "",
                                    "h-4 w-4 mt-0.5 cursor-pointer shrink-0 rounded-full border flex items-center justify-center"
                                  )}
                                  aria-hidden="true"
                                >
                                  <span className="rounded-full bg-white w-1.5 h-1.5" />
                                </span>
                                <span className="ml-3 flex flex-col">
                                  <RadioGroup.Label
                                    as="span"
                                    className={classNames(
                                      checked ? "text-blue-900" : "text-gray-900",
                                      "block text-sm font-medium"
                                    )}
                                  >
                                    {setting.name}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={classNames(
                                      checked ? "text-blue-700" : "text-gray-500",
                                      "block text-sm"
                                    )}
                                  >
                                    {setting.description}
                                  </RadioGroup.Description>
                                  {selected === "custom" && settingIdx === 1 && (
                                    <div className="mt-2">
                                      <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="block w-full rounded-md border-gray-300 shadow-sm py-1.5 px-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        onChange={handleChange}
                                        value={user.password}
                                      />
                                      <div className="text-xs mt-2 text-gray-400">
                                        Password must have at least 8 characters
                                      </div>
                                      <div className="relative flex items-start mt-3">
                                        <div className="flex items-center h-5">
                                          <input
                                            id="changePasswordAtNextLogin"
                                            aria-describedby="changePasswordAtNextLogin"
                                            name="changePasswordAtNextLogin"
                                            type="checkbox"
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            checked={user.changePasswordAtNextLogin}
                                            onChange={() =>
                                              setUser({
                                                ...user,
                                                changePasswordAtNextLogin:
                                                  !user.changePasswordAtNextLogin,
                                              })
                                            }
                                          />
                                        </div>
                                        <div className="ml-3 text-sm">
                                          <label
                                            htmlFor="changePasswordAtNextLogin"
                                            className="font-medium text-gray-700"
                                          >
                                            Ask user to change their password when they sign in
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </span>
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="disabled:bg-gray-300 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    // onClick={submit}
                    disabled={!submittable}
                  >
                    Create User
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={close}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function ErrorMessage({ children }: { children?: ReactNode }) {
  return (
    <div className="mt-2 text-red-500 text-xs flex items-center h-5">
      {children && (
        <ExclamationCircleIcon className="h-4 w-4 mr-2 text-red-500" aria-hidden="true" />
      )}
      {children}
    </div>
  );
}

function TextInput(props: {
  error: boolean;
  errorMessage: ReactNode;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  name: string;
  label: string;
}) {
  const { error, errorMessage, label, name, onChange, value } = props;
  const inputClassName = classNames(
    "block w-full rounded-md border-gray-300 shadow-sm sm:text-sm",
    // { "focus:border-blue-500 focus:ring-blue-500": !error },
    { "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500": error }
  );

  return (
    <div>
      <label
        htmlFor={name}
        className={`block text-sm font-medium ${error ? "text-red-500" : "text-gray-700"}`}
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name={name}
          id={name}
          className={inputClassName}
          onChange={onChange}
          value={value}
        />
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </div>
    </div>
  );
}
