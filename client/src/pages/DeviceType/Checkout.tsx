import { Button, HTMLSelect, Toaster } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import capitalize from "capitalize";
import React, { useState } from "react";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import { APIError } from "../../types/apiResponses";
import Class from "../../types/class";
import { grades } from "../../utils/grades";
import { APIDeviceResponse } from "../../types/apiResponses";
import PaneHeader from "../../components/PaneHeader/PaneHeader";

interface DeviceCheckoutProps {
  classes: Class[];
  device: DeviceModel;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceModel | undefined>>;
  updateDevice: (id: string, newDevice: DeviceModel) => void;
  toasterRef: React.RefObject<Toaster>;
}

export default function Checkout({
  classes,
  device,
  setSelectedDevice,
  updateDevice,
  toasterRef,
}: DeviceCheckoutProps) {
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
      <PaneHeader>Check Out</PaneHeader>
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
}
