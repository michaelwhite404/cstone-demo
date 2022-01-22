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

interface DeviceDataProps {
  device: DeviceModel;
  /** Callback function to run when back button is pressed */
  onBack?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  reFetchDevices: () => Promise<void>;
}

export default function DeviceData({ device: d, onBack, reFetchDevices }: DeviceDataProps) {
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
  } = useDevice(d.deviceType, d.slug);
  useEffect(() => {
    deviceLoaded ? setTimeout(() => setShowData(true), 750) : setShowData(false);
  }, [deviceLoaded]);

  const showCheckout = device?.status === "Available" || (!showData && d.status === "Available");
  const showCheckin = device?.checkedOut;
  const showUpdateError = device?.status === "Broken" && updateableErrors.length > 0;

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
        <div style={{ overflowY: "scroll" }}>
          <div>
            <BasicInfoSection device={device} showData={showData} originalDevice={d} />
            {showUpdateError && (
              <UpdateErrorSection
                errors={updateableErrors}
                updateDeviceError={updateDeviceError}
                showData={showData}
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
        {/* <MainContentFooter align="right">
          <Button />
        </MainContentFooter> */}
      </FadeIn>
    </MainContent.InnerWrapper>
  );
}
