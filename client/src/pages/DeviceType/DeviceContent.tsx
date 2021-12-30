import { Toaster } from "@blueprintjs/core";
import React, { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import { grades } from "../../utils/grades";
import Checkin from "./Checkin";
import Checkout from "./Checkout";
import CheckoutHistory from "./CheckoutHistory";
import "./DeviceContent.sass";
import ErrorHistory from "./ErrorHistory";

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
  const history = useHistory();
  const { url } = useRouteMatch();
  useEffect(() => {}, []);

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
    <>
      <div style={{ height: "calc(100% - 80px)", overflow: "scroll" }}>
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
        <div className="device-pane">
          <CheckoutHistory device={device} />
        </div>
        <div className="device-pane">
          <ErrorHistory device={device} />
        </div>
      </div>
      <div className="drawer-footer">
        <div className="drawer-footer-inner">
          <button>Edit</button>
          <button onClick={() => history.push(`${url}/${device.slug}`)}>{"See All Data >"}</button>
        </div>
      </div>
    </>
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
