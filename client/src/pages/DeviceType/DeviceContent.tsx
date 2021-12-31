import React, { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import { useDevice } from "../../hooks";
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
}: {
  device: DeviceModel;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceModel | undefined>>;
  updateDevice: (id: string, newDevice: DeviceModel) => void;
}) {
  const history = useHistory();
  const { url } = useRouteMatch();
  const { checkouts, errors, checkinDevice, checkoutDevice } = useDevice(
    device.deviceType,
    device.slug
  );
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

  const onCheckoutSuccess = (updatedDevice: DeviceModel) => {
    setSelectedDevice(updatedDevice);
    updateDevice(device._id, updatedDevice);
  };

  const onCheckinSuccess = (updatedDevice: DeviceModel) => {
    setSelectedDevice(updatedDevice);
    updateDevice(device._id, updatedDevice);
  };

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
              checkoutDevice={checkoutDevice}
              onCheckoutSuccess={onCheckoutSuccess}
            />
          </div>
        )}
        {device.status === "Checked Out" && (
          <div className="device-pane">
            <Checkin
              device={device}
              checkinDevice={checkinDevice}
              onCheckinSuccess={onCheckinSuccess}
            />
          </div>
        )}
        <div className="device-pane">
          <CheckoutHistory checkouts={checkouts} />
        </div>
        <div className="device-pane">
          <ErrorHistory errors={errors} />
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
