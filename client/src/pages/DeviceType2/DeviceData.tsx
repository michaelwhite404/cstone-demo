import React, { useEffect, useState } from "react";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import BackButton from "../../components/BackButton";
import DeviceStatusBadge from "../../components/Badges/DeviceStatusBagde";
import FadeIn from "../../components/FadeIn";
import {
  BasicInfoSection,
  CheckInSection,
  CheckoutLogSection,
  CheckOutSection,
  ErrorLogSection,
  UpdateErrorSection,
} from "./Sections";
import MainContent from "../../components/MainContent";
import { useDevice, useToasterContext } from "../../hooks";
import BadgeSkeleton from "../../components/BadgeSkeleton";
import { Button, ButtonGroup, IconName } from "@blueprintjs/core";
import CreateError from "./Modals/CreateError";
import { EmployeeModel } from "../../../../src/types/models/employeeTypes";
import { useOutletContext, useParams } from "react-router-dom";

interface DeviceDataProps {
  device?: DeviceModel;
  /** Callback function to run when back button is pressed */
  onBack?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  reFetchDevices: () => Promise<void>;
  dialogControls: {
    open: (title: string, width: string | number, Component: JSX.Element) => void;
    close: () => void;
  };
  user: EmployeeModel;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceModel | undefined>>;
}
interface SubHeadingButton {
  text: string;
  icon: IconName;
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  show?: boolean;
  disabled?: boolean;
}

export default function DeviceData() {
  const [showData, setShowData] = useState(false);
  const { deviceType, slug } = useParams<"deviceType" | "slug">();
  const {
    device: d,
    reFetchDevices,
    dialogControls,
    user,
    setSelectedDevice,
    onBack,
  } = useOutletContext<DeviceDataProps>();
  const {
    device,
    deviceLoaded,
    checkoutDevice,
    checkinDevice,
    checkouts,
    errors,
    updateDeviceError,
    updateableErrors,
    createDeviceError,
    assignDevice,
    unassignDevice,
  } = useDevice(deviceType!, slug!);
  const { showToaster } = useToasterContext();

  useEffect(() => {
    deviceLoaded ? setTimeout(() => setShowData(true), 750) : setShowData(false);
  }, [deviceLoaded]);
  useEffect(() => setSelectedDevice(device), [device, setSelectedDevice]);
  const showCheckout =
    ["Available", "Assigned"].includes(device?.status || "") ||
    (!showData && ["Available", "Assigned"].includes(d?.status || dummyDevice.status));
  const showCheckin = device?.checkedOut;
  const showUpdateError = device?.status === "Broken" && updateableErrors.length > 0;

  const subHeadingButtons: SubHeadingButton[] = [
    {
      text: "Reset",
      icon: "reset",
      onClick: () => {},
      show: Boolean(device?.directoryId) && user.role === "Super Admin",
      disabled: true,
    },
    {
      text: "Create Error",
      icon: "warning-sign",
      onClick: () =>
        dialogControls.open(
          `Create Error`,
          600,
          <CreateError
            close={dialogControls.close}
            createError={createDeviceError}
            reFetchDevices={reFetchDevices}
          />
        ),
      show: device?.status !== "Checked Out",
    },
  ];
  const showableButtons = subHeadingButtons.filter((v) => v.show);

  const handleUnassign = () => {
    unassignDevice()
      .then(() => {
        showToaster("Device unassigned!", "success");
        reFetchDevices();
      })
      .catch((err) => showToaster(err.message, "danger"));
  };

  return (
    <MainContent.InnerWrapper>
      <FadeIn>
        <MainContent.Header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={onBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>{d?.name || ""}</span>
          </div>
          {showData ? <DeviceStatusBadge status={device!.status} /> : <BadgeSkeleton />}
        </MainContent.Header>
        {showableButtons.length > 0 && (
          <MainContent.Header>
            <ButtonGroup style={{ marginLeft: "auto" }}>
              {showableButtons.map(({ text, icon, onClick, disabled }) => (
                <Button key={text} text={text} icon={icon} onClick={onClick} disabled={disabled} />
              ))}
            </ButtonGroup>
          </MainContent.Header>
        )}
        <div style={{ overflowY: "scroll" }}>
          <div>
            <BasicInfoSection
              device={device}
              showData={showData}
              originalDevice={d || dummyDevice}
            />
            {showUpdateError && (
              <UpdateErrorSection
                errors={updateableErrors}
                updateDeviceError={updateDeviceError}
                showData={showData}
                onUpdateErrorSuccess={reFetchDevices}
              />
            )}
            {showCheckout && (
              <CheckOutSection
                device={device}
                showData={showData}
                checkoutDevice={checkoutDevice}
                onCheckoutSuccess={reFetchDevices}
                assignDevice={assignDevice}
                onAssignSuccess={reFetchDevices}
              />
            )}
            {showCheckin && (
              <CheckInSection
                device={device}
                showData={showData}
                checkinDevice={checkinDevice}
                onCheckinSuccess={reFetchDevices}
              />
            )}
            <CheckoutLogSection
              checkouts={checkouts}
              showData={showData}
              originalStatus={d?.status || "Checked Out"}
            />
            <ErrorLogSection errors={errors} showData={showData} />
          </div>
        </div>
        {device?.status === "Assigned" && (
          <MainContent.Footer>
            <Button text="Unassign" onClick={handleUnassign} intent="primary" />
          </MainContent.Footer>
        )}
      </FadeIn>
    </MainContent.InnerWrapper>
  );
}

const dummyDevice: DeviceModel = {
  _id: "6008a0299eb4415e7cbc8042",
  status: "Available",
  checkedOut: false,
  name: "FC 01",
  brand: "HP",
  model: "Fake Chromebook",
  serialNumber: "1122334455",
  macAddress: "11:22:33:44:55:66",
  deviceType: "chromebook",
  slug: "fc-01",
  lastCheckOut: new Date("2022-01-26T06:50:11.913+00:00"),
  lastUser: "5f43ba6edca18d644cbf6cf1",
  lastCheckIn: new Date("2022-01-26T06:50:18.372+00:00"),
};
