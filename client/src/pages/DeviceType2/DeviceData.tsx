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
import { useDevice } from "../../hooks";
import BadgeSkeleton from "../../components/BadgeSkeleton";
import { Button, ButtonGroup, IconName } from "@blueprintjs/core";
import ResetBody from "../DeviceType/SingleDevice/ResetBody";
import CreateError from "./Modals/CreateError";
import { EmployeeModel } from "../../../../src/types/models/employeeTypes";

interface DeviceDataProps {
  device: DeviceModel;
  /** Callback function to run when back button is pressed */
  onBack?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  reFetchDevices: () => Promise<void>;
  dialogControls: {
    open: (title: string, width: string | number, Component: JSX.Element) => void;
    close: () => void;
  };
  user: EmployeeModel;
}
interface SubHeadingButton {
  text: string;
  icon: IconName;
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  show?: boolean;
}

export default function DeviceData({
  device: d,
  onBack,
  reFetchDevices,
  dialogControls,
  user,
}: DeviceDataProps) {
  const [showData, setShowData] = useState(false);
  const {
    device,
    deviceLoaded,
    checkoutDevice,
    checkinDevice,
    checkouts,
    errors,
    updateDeviceError,
    updateableErrors,
    resetDevice,
    createDeviceError,
  } = useDevice(d.deviceType, d.slug);
  useEffect(() => {
    deviceLoaded ? setTimeout(() => setShowData(true), 750) : setShowData(false);
  }, [deviceLoaded]);

  const showCheckout = device?.status === "Available" || (!showData && d.status === "Available");
  const showCheckin = device?.checkedOut;
  const showUpdateError = device?.status === "Broken" && updateableErrors.length > 0;

  const subHeadingButtons: SubHeadingButton[] = [
    {
      text: "Reset",
      icon: "reset",
      onClick: () =>
        dialogControls.open(
          `Reset ${d.name}`,
          400,
          <ResetBody close={dialogControls.close} resetDevice={resetDevice} />
        ),
      show: Boolean(device?.directoryId) && user.role === "Super Admin",
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

  return (
    <MainContent.InnerWrapper>
      <FadeIn>
        <MainContent.Header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={onBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>{d.name}</span>
          </div>
          {showData ? <DeviceStatusBadge status={device!.status} /> : <BadgeSkeleton />}
        </MainContent.Header>
        {showableButtons.length > 0 && (
          <MainContent.Header>
            <ButtonGroup style={{ marginLeft: "auto" }}>
              {showableButtons.map(({ text, icon, onClick }) => (
                <Button key={text} text={text} icon={icon} onClick={onClick} />
              ))}
            </ButtonGroup>
          </MainContent.Header>
        )}
        <div style={{ overflowY: "scroll" }}>
          <div>
            <BasicInfoSection device={device} showData={showData} originalDevice={d} />
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
              originalStatus={d.status}
            />
            <ErrorLogSection errors={errors} showData={showData} />
          </div>
        </div>
      </FadeIn>
    </MainContent.InnerWrapper>
  );
}
