import { Button, HTMLSelect, Toaster } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import capitalize from "capitalize";
import React, { useEffect, useState } from "react";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import { APIError } from "../../types/apiResponses";
import Class from "../../types/class";
import { grades } from "../../utils/grades";
import "./DeviceContent.sass";
import { APIDeviceResponse } from "../../types/apiResponses";

export default function DeviceContent({
  device,
  setSelectedDevice,
  updateDevice,
  toasterRef,
}: {
  device: DeviceModel;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceModel | undefined>>;
  updateDevice: (id: string, newDevice: DeviceModel) => void;
  toasterRef: React.RefObject<Toaster>;
}) {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    getStudents();

    async function getStudents() {
      try {
        const res = await axios.get("/api/v2/students/group");
        setClasses(res.data.data.grades);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, []);

  const values = [
    { heading: "Model", value: device.model },
    { heading: "Serial Number", value: device.serialNumber },
    { heading: "MAC Address", value: device.macAddress },
    { heading: "Management Type", value: "Cloud" },
    { heading: "Device Type", value: "Education Upgrade" },
    { heading: "Auto Update Expiration", value: device.autoUpdateExpiration },
    {
      heading: "Checked Out By",
      value: device.checkedOut
        ? `${device.lastUser.fullName} (${grades[device.lastUser.grade]})`
        : undefined,
    },
    {
      heading: "Teacher Check Out",
      value: device.checkedOut ? device.teacherCheckOut.fullName : undefined,
    },
    {
      heading: "Check Out Date",
      value: device.checkedOut ? new Date(device.lastCheckOut!).toLocaleString() : undefined,
    },
  ];

  return (
    <div>
      <div className="device-pane" style={{ display: "flex", flexWrap: "wrap" }}>
        {values.map((box) => (
          <DeviceBasicInfo heading={box.heading} value={box.value} key={box.heading} />
        ))}
      </div>
      {device.status === "Available" && (
        <div className="device-pane">
          <Checkout
            classes={classes}
            device={device}
            setSelectedDevice={setSelectedDevice}
            updateDevice={updateDevice}
            toasterRef={toasterRef}
          />
        </div>
      )}
    </div>
  );
}

const DeviceBasicInfo = ({ heading, value }: { heading: string; value?: string }) => {
  return value ? (
    <div style={{ width: "33.33%", padding: "15px 0" }}>
      <h4>{heading}</h4>
      {value}
    </div>
  ) : (
    <></>
  );
};

const Checkout = ({
  classes,
  device,
  setSelectedDevice,
  updateDevice,
  toasterRef,
}: {
  classes: Class[];
  device: DeviceModel;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceModel | undefined>>;
  updateDevice: (id: string, newDevice: DeviceModel) => void;
  toasterRef: React.RefObject<Toaster>;
}) => {
  const [gradeSelect, setGradeSelect] = useState(-1);
  const [studentPicked, setStudentPicked] = useState<string>("-1");
  const gradeValues = grades.map((value, i) => ({
    value: `${i}`,
    label: i === 0 ? "Kindergarten" : value,
  }));
  gradeValues.unshift({ value: "-1", label: "Select a grade" });
  const selectAStudent = { label: "Select A Student", value: "-1" };
  const studentOptions =
    gradeSelect === -1
      ? undefined
      : classes[gradeSelect].students.map((s) => ({
          label: s.fullName,
          value: s.id,
        }));
  studentOptions?.unshift(selectAStudent);

  const changeGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGradeSelect(+e.target.value);
    setStudentPicked("-1");
  };

  const checkoutDevice = async () => {
    try {
      const res = await axios.post<APIDeviceResponse>(
        `/api/v2/devices/${device._id}/check-out/student/${studentPicked}`
      );
      const newDevice = res.data.data.device;
      setSelectedDevice(newDevice);
      updateDevice(device._id, newDevice);
      toasterRef.current!.show({
        message: `${device.name} successfully checked out`,
        intent: "success",
        icon: "tick",
      });
    } catch (err) {
      console.log((err as AxiosError<APIError>).response?.data);
    }
  };
  return (
    <div>
      <h3 style={{ color: "#848181" }}>Check Out</h3>
      <div className="flex space-between">
        <div className="device-checkout-box">
          <span style={{ fontWeight: 500, marginBottom: "6px" }}>Grade</span>
          <HTMLSelect value={gradeSelect} options={gradeValues} onChange={changeGrade} />
        </div>
        <div className="device-checkout-box">
          <span style={{ fontWeight: 500, marginBottom: "6px" }}>Student</span>
          <HTMLSelect
            disabled={gradeSelect < 0}
            value={studentPicked}
            options={studentOptions || [selectAStudent]}
            onChange={(e) => setStudentPicked(e.target.value)}
          />
        </div>
        <div className="device-checkout-box button">
          <Button intent="primary" disabled={studentPicked === "-1"} onClick={checkoutDevice}>
            Check Out {capitalize(device.deviceType)}
          </Button>
        </div>
      </div>
    </div>
  );
};
