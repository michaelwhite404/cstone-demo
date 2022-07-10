import { XIcon } from "@heroicons/react/solid";
import { useState } from "react";
import Select from "react-select";
import { EmployeeModel } from "../../../../src/types/models";
import LabeledInput2 from "../../components/LabeledInput2";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import "./AddEntry.sass";

export default function AddEntry(props: AddEntryProps) {
  const [entry, setEntry] = useState({
    description: "",
    department: "",
    date: new Date(),
    timeStart: "",
    timeEnd: "",
  });
  const times = createTimes();

  return (
    <div className="p-10">
      <div className="flex text-2xl font-semibold mb-6 justify-between">
        <span>New Time Entry</span>{" "}
        <XIcon
          className="text-blue-400 w-5 hover:text-blue-500 cursor-pointer"
          onClick={props.closeModal}
        />
      </div>
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-4">
        <div className="col-span-2">
          <label>Description</label>
          <div className="mt-1">
            <input
              className="entry-input px-3 py-2.5 w-full rounded "
              // style={{ border: "1px #ccc solid" }}
            />
          </div>
        </div>
        <div className="col-span-2">
          <label>Department</label>
          <Select
            className="mt-1"
            styles={{
              //@ts-ignore
              indicatorSeparator: () => {}, // removes the "stick"
            }}
            options={
              props.user?.employeeOf?.map((dept) => ({ label: dept.name, value: dept._id })) || []
            }
          />
        </div>
        <div className="col-span-2">
          <LabeledInput2 label="Date" name="date" />
        </div>
        <div>
          <label>Time Start</label>
          <Select
            className="mt-1"
            styles={{
              //@ts-ignore
              indicatorSeparator: () => {}, // removes the "stick"
              dropdownIndicator: (defaultStyles) => ({
                ...defaultStyles,
                "& svg": { display: "none" },
              }),
            }}
            options={times.map((t) => ({ label: t, value: t }))}
          />
        </div>
        <div>
          <label>Time End</label>
          <Select
            className="mt-1"
            styles={{
              //@ts-ignore
              indicatorSeparator: () => {}, // removes the "stick"
              dropdownIndicator: (defaultStyles) => ({
                ...defaultStyles,
                "& svg": { display: "none" },
              }),
            }}
            options={times.map((t) => ({ label: t, value: t }))}
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <PrimaryButton text="Add" /*  disabled  */ />
      </div>
    </div>
  );
}

interface AddEntryProps {
  user: EmployeeModel | null;
  closeModal: () => void;
}

const createTimes = (interval: number = 15) => {
  const times = []; // time array
  let tt = 0; // start time
  const ap = ["AM", "PM"]; // AM-PM

  //loop to increment the time and push results in array
  for (let i = 0; tt < 24 * 60; i++) {
    const hour = Math.floor(tt / 60); // getting hours of day in 0-24 format
    const minute = tt % 60; // getting minutes of the hour in 0-55 format
    times[i] = `${hour === 0 || hour === 12 ? "12" : (hour % 12).toString().slice(-2)}:${(
      "0" + minute
    ).slice(-2)} ${ap[hour < 12 ? 0 : 1]}`;
    tt = tt + interval;
  }

  return times;
};
