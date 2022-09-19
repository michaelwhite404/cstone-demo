import axios from "axios";
import { Divider, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DepartmentModel, EmployeeModel } from "../../../../src/types/models";
import BackButton from "../../components/BackButton";
import LabeledInput2 from "../../components/LabeledInput2";
import { AddOnInput } from "../../components/Inputs";
import DepartmentList from "./UserData/DepartmentList";
import GroupList from "./UserData/GroupsList";
import { grades } from "../../utils/grades";

export default function UserData() {
  const [user, setUser] = useState<EmployeeModel>();
  const [userEdit, setUserEdit] = useState<EmployeeModel>();
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  // const [pageState, setPageState] = useState<"loading" | "display" | "edit">("display");
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as any;

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`/api/v2/users/${slug}`, { params: { projection: "FULL" } });
      setUser(res.data.data.user);
      setUserEdit(res.data.data.user);
    };

    const getDepartments = async () => {
      const res = await axios.get("/api/v2/departments");
      setDepartments(res.data.data.departments);
    };

    getUser();
    getDepartments();
  }, [slug]);

  const goToUsersPage = () => (locationState.fromUsersPage ? navigate(-1) : navigate("/users"));

  let image = user?.image || "../avatar_placeholder.png";
  if (image && image.endsWith("=s96-c")) {
    image = image.replace("=s96-c", "");
  }

  const handleChange = <T extends HTMLElement>(e: React.ChangeEvent<T>) => {
    //@ts-ignore
    setUserEdit({ ...userEdit, [e.target.name]: e.target.value });
  };

  const addDepartmentMember = async (
    department: {
      _id: string;
      name: string;
    },
    role: "MEMBER" | "LEADER"
  ) => {
    if (!user) return;
    await axios.post(`/api/v2/departments/${department._id}/members`, {
      users: [{ id: user._id, role }],
    });
    if (!user.departments) return setUser({ ...user, departments: [{ ...department, role }] });
    const sortedDepartments = [...user.departments, { ...department, role }].sort((a, b) =>
      a.name!.localeCompare(b.name!)
    );
    setUser({ ...user, departments: sortedDepartments });
  };

  return (
    <div className="flex flex-col sm:px-6 px-4 pb-6 pt-2.5">
      <div className="my-4 hover:underline cursor-pointer max-w-fit" onClick={goToUsersPage}>
        <BackButton />
        Back to users
      </div>
      <div className="flex px-5">
        <img
          className="rounded-full md:w-36 md:h-36 w-28 h-28 border-blue-400 border-solid border-4 p-1 md:p-1.5"
          src={image}
          onError={(e) => (e.currentTarget.src = "../avatar_placeholder.png")}
          alt={user?.fullName}
        />
        <div className="ml-4 pt-4">
          <span className="block font-black mb-1 md:mb-2.5 text-2xl md:text-4xl">
            {user?.fullName}
          </span>
          <span className="md:text-lg text-md font-light text-gray-500">{user?.title}</span>
        </div>
      </div>
      <Divider className="py-3" />
      <div className="mt-5 px-5 grid md:grid-cols-2 grid-cols-1 gap-6">
        <div>
          <LabeledInput2
            name="firstName"
            label="First Name"
            value={userEdit?.firstName || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <LabeledInput2
            name="lastName"
            label="Last Name"
            value={userEdit?.lastName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2 md:w-3/5">
          <LabeledInput2
            name="title"
            label="Title"
            value={userEdit?.title || ""}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2 md:w-3/5">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={userEdit?.role || ""}
              onChange={handleChange}
            >
              <option>Super Admin</option>
              <option>Admin</option>
              <option>Development</option>
              <option>Instructor</option>
              <option>Maintenance</option>
              <option>Intern</option>
            </select>
          </div>
        </div>
        <div className="md:col-span-2 md:w-3/5">
          <AddOnInput
            addOnSide="right"
            name="email"
            label="Email Address"
            addOnText="@cornerstone-schools.org"
            value={userEdit?.email.split("@")[0] || ""}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2 md:w-3/5">
          <LabeledInput2
            className="bg-gray-200"
            name="slug"
            label="Slug"
            value={userEdit?.slug || ""}
            disabled
            readOnly
          />
        </div>
        <div className="md:col-span-2 md:w-44">
          <label htmlFor="homeroomGrade" className="block text-sm font-medium text-gray-700">
            Homeroom Grade
          </label>
          <select
            name="homeroomGrade"
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={String(userEdit?.homeroomGrade) || ""}
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
        <div className="">
          <div className="flex align-center">
            <label
              htmlFor="timesheetEnabled"
              className="block text-sm font-medium text-gray-700 mr-5"
            >
              Timesheet Enabled
            </label>
            <Switch
              name="timesheetEnabled"
              checked={userEdit?.timesheetEnabled || false}
              onChange={() =>
                handleChange({
                  //@ts-ignore
                  target: { name: "timesheetEnabled", value: !userEdit?.timesheetEnabled },
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="py-10 px-20">
        <Divider />
      </div>
      <div className="mx-5">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            <DepartmentList
              user={user}
              departments={departments}
              addDepartmentMember={addDepartmentMember}
            />
          </div>
          <div className="px-5 py-5 md:py-0">
            <Divider className="hidden md:block" orientation="vertical" />
            <Divider className="md:hidden" orientation="horizontal" />
          </div>
          <div className="flex-1">
            <GroupList userGroups={userEdit?.groups || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
