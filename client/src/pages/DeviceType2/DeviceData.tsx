import { Button } from "@blueprintjs/core";
import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import BackButton from "../../components/BackButton";
import DeviceStatusBadge from "../../components/Badges/DeviceStatusBagde";
import FadeIn from "../../components/FadeIn";
import {
  MainContentFooter,
  MainContentHeader,
  MainContentInnerWrapper,
} from "../../components/MainContent";
import { useDevice } from "../../hooks";
import { grades } from "../../utils/grades";

interface DeviceDataProps {
  device: DeviceModel;
  onBack?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default function DeviceData({ device: d, onBack }: DeviceDataProps) {
  const [showData, setShowData] = useState(false);
  const { device, deviceLoaded } = useDevice(d.deviceType, d.slug);
  useEffect(() => {
    deviceLoaded ? setTimeout(() => setShowData(true), 750) : setShowData(false);
  }, [deviceLoaded]);

  return (
    <MainContentInnerWrapper>
      <FadeIn>
        <MainContentHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={onBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>{d.name}</span>
          </div>
          <DeviceStatusBadge status={d.status} />
        </MainContentHeader>
        <div style={{ overflowY: "scroll" }}>
          <div>
            <BasicInfoSection device={device} showData={showData} originalDevice={d} />
            {/* <span>Basic Info</span>
            <div>Model: {device?.model}</div>
            <div>Serial Number: {device?.serialNumber}</div>
            <div>MAC Address: {device?.macAddress}</div>
            <div>Management Type: Cloud</div>
            <div>Device Type: Education Upgrade</div>
            <div>Auto Update Expiration: {device?.autoUpdateExpiration}</div> */}
          </div>
        </div>
        <MainContentFooter align="right">
          <Button />
        </MainContentFooter>
      </FadeIn>
    </MainContentInnerWrapper>
  );
}

const BasicInfoSection = ({
  device,
  showData,
  originalDevice,
}: {
  device?: DeviceModel;
  showData: boolean;
  originalDevice: DeviceModel;
}) => {
  const values = [
    { heading: "Model", value: device?.model, showSkeleton: true },
    { heading: "Serial Number", value: device?.serialNumber, showSkeleton: true },
    { heading: "MAC Address", value: device?.macAddress, showSkeleton: true },
    { heading: "Management Type", value: "Cloud", showSkeleton: true },
    { heading: "Device Type", value: "Education Upgrade", showSkeleton: true },
    {
      heading: "Auto Update Expiration",
      value: device?.autoUpdateExpiration,
      showSkeleton: originalDevice.deviceType === "chromebook",
    },
    {
      heading: "Checked Out By",
      value: device?.checkedOut
        ? `${device?.lastUser.fullName} (${grades[device?.lastUser.grade]})`
        : undefined,
      showSkeleton: originalDevice.checkedOut,
    },
    {
      heading: "Teacher Check Out",
      value: device?.checkedOut ? device?.teacherCheckOut.fullName : undefined,
      showSkeleton: originalDevice.checkedOut,
    },
    {
      heading: "Check Out Date",
      value: device?.checkedOut ? new Date(device?.lastCheckOut!).toLocaleString() : undefined,
      showSkeleton: originalDevice.checkedOut,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ paddingLeft: 15 }}>Basic Info</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {values.map((value) => (
          <>
            {showData ? (
              <div style={{ width: "33.33%", padding: 15 }}>
                <div style={{ fontWeight: 500, marginBottom: 5 }}>{value.heading}</div>
                <div style={{ color: "#8f8f8f" }}>{value.value}</div>
              </div>
            ) : (
              value.showSkeleton && (
                <div style={{ width: "33.33%", padding: 15 }}>
                  <Skeleton width="33%" sx={{ bgcolor: "grey.400" }} />
                  <Skeleton width="90%" />
                </div>
              )
            )}
          </>
        ))}
      </div>
    </div>
  );
};
