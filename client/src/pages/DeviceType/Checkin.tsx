import { Button, Classes, Radio, TextArea, Toaster } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import { APIError } from "../../types/apiResponses";

export default function Checkin({
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
  const [radio, setRadio] = useState<string | undefined>(undefined);
  const [error, setError] = useState({
    title: "",
    description: "",
  });
  const handleRadioChange = (e: React.FormEvent<HTMLDivElement>) => {
    // @ts-ignore
    setRadio(e.target.value as string);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> & React.ChangeEventHandler<HTMLTextAreaElement>
  ) => {
    setError({ ...error, [e.target.name]: e.target.value });
  };

  const submittable = () => {
    let submittable = false;
    if (radio === "passed") submittable = true;
    if (radio === "error" && error.title.length > 0 && error.description.length > 0)
      submittable = true;
    return submittable;
  };

  const checkinDevice = async () => {
    let data: any = {
      error: radio === "error",
      title: error.title,
      description: error.description,
    };

    if (submittable()) {
      try {
        const res = await axios.post(
          `/api/v2/devices/${device._id}/check-in`,
          radio === "error" ? data : {}
        );
        const updatedDevice: DeviceModel = res.data.data.device;
        setSelectedDevice(updatedDevice);
        updateDevice(device._id, updatedDevice);
        toasterRef.current!.show({
          message: `${device.name} successfully checked in`,
          intent: "success",
          icon: "tick",
        });
      } catch (err) {
        console.log((err as AxiosError<APIError>).response?.data);
      }
    }
  };

  return (
    <div>
      <PaneHeader>Check In</PaneHeader>
      <div className="flex">
        <div style={{ width: "65%" }}>
          <div style={{ marginBottom: "25px" }} onChange={handleRadioChange}>
            <Radio className="radio" name="checkin-device" value="passed">
              {device.lastUser!.fullName} has returned the {device.deviceType} in working condition
            </Radio>
            <Radio className="radio" name="checkin-device" value="error">
              There is an issue with the {device.deviceType}
            </Radio>
          </div>
          {radio === "error" && (
            <div style={{ width: "75%" }}>
              <div
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}
              >
                <label htmlFor="error-title">Title of Issue</label>
                <input
                  className={Classes.INPUT}
                  name="title"
                  type="text"
                  dir="auto"
                  style={{ minWidth: "250px" }}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label htmlFor="error-description">Description of Issue</label>
                <TextArea
                  style={{ minWidth: "250px", maxWidth: "250px", minHeight: "175px" }}
                  name="description"
                  // @ts-ignore
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>
        <div className="device-checkin-box button" style={{ justifyContent: "flex-start" }}>
          <Button intent="primary" disabled={!submittable()} onClick={checkinDevice}>
            Check In {device.deviceType}
          </Button>
        </div>
      </div>
    </div>
  );
}
