import { Toaster } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import { APIError } from "../../types/apiResponses";
import Class from "../../types/class";
import { grades } from "../../utils/grades";
import Checkin from "./Checkin";
import Checkout from "./Checkout";
import "./DeviceContent.sass";

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
    <div style={{ height: "calc(100% - 40px)", overflow: "scroll" }}>
      <div className="device-pane">
        <PaneHeader>Basic Info</PaneHeader>
        <div className="basic-info-box-wrapper">
          {values.map((box) => (
            <DeviceBasicInfo heading={box.heading} value={box.value} key={box.heading} />
          ))}
        </div>
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
      {device.status === "Checked Out" && (
        <div className="device-pane">
          <Checkin
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
