import axios from "axios";
import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { EmployeeModel } from "../../../../src/types/models";
import BackButton from "../../components/BackButton";
import LabeledInput2 from "../../components/LabeledInput2";
import { AddOnInput } from "../../components/Inputs";

export default function UserData() {
  const [user, setUser] = useState<EmployeeModel>();
  const [pageState, setPageState] = useState<"loading" | "display" | "edit">("display");
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const getUser = async () => {
    const res = await axios.get("/api/v2/users", { params: { slug } });
    const { users } = res.data.data;
    if (users.length === 1) setUser(users[0]);
  };

  useEffect(() => {
    getUser();
  }, []);

  const goToUsersPage = () =>
    (location.state as any).fromUsersPage ? navigate(-1) : navigate("/users");

  let image = user?.image || "../avatar_placeholder.png";
  // if (image && image.endsWith("=s96-c")) {
  //   image = image.replace("=s96-c", "");
  // }

  return (
    <div className="flex flex-col h-full" style={{ padding: "10px 25px 25px" }}>
      <div className="my-4 hover:underline cursor-pointer" onClick={goToUsersPage}>
        <BackButton />
        Back to users
      </div>
      <div className="flex px-5">
        <img
          className="rounded-full w-36 h-36 border-blue-400 border-solid border-4 p-1.5"
          src={image}
          onError={(e) => {
            //@ts-ignore
            e.target.src = "../avatar_placeholder.png";
          }}
        />
        <div className="ml-4 pt-4">
          <span className="block font-black mb-2.5 text-4xl">{user?.fullName}</span>
          <span className="text-lg font-light text-gray-500">{user?.title}</span>
        </div>
      </div>
      <Divider className="py-2" />
      <div className="mt-5 px-5 w-1/2">
        <div className="mb-6">
          {/* <div className="font-medium mb-1">Full Name</div>
          <div className="text-gray-400">{user?.fullName}</div> */}
          <LabeledInput2 name="fullName" label="Full Name" value={user?.fullName} />
        </div>
        <div className="mb-6">
          {/* <div className="font-medium mb-1">Title</div>
          <div className="text-gray-400">{user?.title}</div> */}
          <LabeledInput2 name="title" label="Title" value={user?.title} />
        </div>
        <div className="mb-6">
          {/* <div className="font-medium mb-1">Role</div>
          <div className="text-gray-400">{user?.role}</div> */}
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="name"
              name="name"
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={user?.role}
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
        <div className="mb-6">
          <AddOnInput
            addOnSide="right"
            label="Email Address"
            addOnText="@cornerstone-schools.org"
            value={user?.email.split("@")[0]}
          />
        </div>

        <div className="mb-6">
          {/* <div className="font-medium mb-1">Slug</div>
          <div className="text-gray-400">{user?.slug}</div> */}
          <LabeledInput2 name="slug" label="Slug" value={user?.slug} />
        </div>
      </div>
    </div>
  );
}
