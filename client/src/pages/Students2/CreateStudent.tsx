import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Divider } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import FadeIn from "../../components/FadeIn";
import { AddOnInput } from "../../components/Inputs";
import LabeledInput2 from "../../components/LabeledInput2";
import MainContent from "../../components/MainContent";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useToggle } from "../../hooks";
import { grades } from "../../utils/grades";

export default function CreateStudent() {
  const navigate = useNavigate();

  const [showPassword, toggle] = useToggle(false);

  const handleBack = () => navigate("/students");

  return (
    <MainContent.InnerWrapper>
      <FadeIn>
        <MainContent.Header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={handleBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>Create Student</span>
          </div>
        </MainContent.Header>
        <div style={{ overflowY: "scroll" }}>
          <div className="w-full flex justify-center py-10">
            <div style={{ width: "80%" }}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <LabeledInput2 label="First Name" required />
                </div>
                <div>
                  <LabeledInput2 label="Last Name" required />
                </div>
                <div className="col-span-2">
                  <AddOnInput
                    label="School Email Address"
                    addOnText="@cornestone-schools.org"
                    addOnSide="right"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option>Active</option>
                    <option>Graduate</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <select
                    name="grade"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="" />
                    {grades.map((value, i) => (
                      <option key={value} value={i}>
                        {i === 0 ? "Kindergarten" : `${value} Grade`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="my-10">
                <Divider />
              </div>
              <div className="flex items-end justify-center">
                <div className="flex-1">
                  <LabeledInput2
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                </div>
                <div className="ml-5 relative bottom-1">
                  <button
                    className="w-8 text-blue-500 p-1.5 hover:bg-gray-100 rounded-lg"
                    onClick={toggle}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MainContent.Footer>
          <PrimaryButton text="Create Student" disabled />
        </MainContent.Footer>
      </FadeIn>
    </MainContent.InnerWrapper>
  );
}
