import axios from "axios";
import { Divider, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DepartmentModel, EmployeeModel } from "../../../../src/types/models";
import BackButton from "../../components/BackButton";
import LabeledInput2 from "../../components/LabeledInput2";
import { AddOnInput } from "../../components/Inputs";
import DepartmentList from "./UserData/DepartmentList";
import { admin_directory_v1 } from "googleapis";
import GroupList from "./UserData/GroupsList";
import { grades } from "../../utils/grades";

export default function UserData() {
  const [user, setUser] = useState<EmployeeModel>();
  const [userEdit, setUserEdit] = useState<EmployeeModel>();
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [groups, setGroups] = useState<admin_directory_v1.Schema$Group[]>([]);
  // const [pageState, setPageState] = useState<"loading" | "display" | "edit">("display");
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get("/api/v2/users", { params: { slug } });
      const { users } = res.data.data;
      if (users.length === 1) {
        setUser(users[0]);
        setUserEdit(users[0]);
      }
    };

    const getDepartments = async () => {
      const res = await axios.get("/api/v2/departments");
      setDepartments(res.data.data.departments);
    };

    getUser();
    getDepartments();
  }, [slug]);

  useEffect(() => {
    const getUserGroups = async () => {
      if (user) {
        const res = await axios.get(`/api/v2/groups/${user.email}`);
        setGroups(res.data.data.groups);
      }
    };
    getUserGroups();
  }, [user]);

  const goToUsersPage = () =>
    (location.state as any).fromUsersPage ? navigate(-1) : navigate("/users");

  let image = user?.image || "../avatar_placeholder.png";
  if (image && image.endsWith("=s96-c")) {
    image = image.replace("=s96-c", "");
  }

  const handleChange = <T extends HTMLElement>(e: React.ChangeEvent<T>) => {
    console.log();
    //@ts-ignore
    setUserEdit({ ...userEdit, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col" style={{ padding: "10px 25px 25px" }}>
      <div className="my-4 hover:underline cursor-pointer" onClick={goToUsersPage}>
        <BackButton />
        Back to users
      </div>
      <div className="flex px-5">
        <img
          className="rounded-full w-36 h-36 border-blue-400 border-solid border-4 p-1.5"
          src={image}
          onError={(e) => (e.currentTarget.src = "../avatar_placeholder.png")}
          alt={user?.fullName}
        />
        <div className="ml-4 pt-4">
          <span className="block font-black mb-2.5 text-4xl">{user?.fullName}</span>
          <span className="text-lg font-light text-gray-500">{user?.title}</span>
        </div>
      </div>
      <Divider className="py-3" />
      <div className="mt-5 px-5 grid grid-cols-2 gap-6">
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
        <div className="col-span-2 w-3/5">
          <LabeledInput2
            name="title"
            label="Title"
            value={userEdit?.title || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-span-2 w-3/5">
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
        <div className="col-span-2 w-3/5">
          <AddOnInput
            addOnSide="right"
            name="email"
            label="Email Address"
            addOnText="@cornerstone-schools.org"
            value={userEdit?.email.split("@")[0] || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-span-2 w-3/5">
          <LabeledInput2 name="slug" label="Slug" value={userEdit?.slug || ""} disabled readOnly />
        </div>
        <div className="col-span-2 w-44">
          <label htmlFor="homeroomGrade" className="block text-sm font-medium text-gray-700">
            Homeroom Grade
          </label>
          <select
            name="homeroomGrade"
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={userEdit?.homeroomGrade || ""}
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
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-6">
            <DepartmentList user={user} departments={departments} />
          </div>
          <div className="col-span-6">
            <GroupList userGroups={groups} />
          </div>
        </div>
      </div>
    </div>
  );
}
