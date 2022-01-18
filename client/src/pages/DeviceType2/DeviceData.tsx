import { Button } from "@blueprintjs/core";
import React from "react";
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

interface DeviceDataProps {
  device: DeviceModel;
  onBack?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default function DeviceData({ device: d, onBack }: DeviceDataProps) {
  const { device } = useDevice(d.deviceType, d.slug);
  console.log(device);
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
            <span>Basic Info</span>
            <div>Model: {device?.model}</div>
            <div>Serial Number: {device?.serialNumber}</div>
            <div>MAC Address: {device?.macAddress}</div>
            <div>Management Type: Cloud</div>
            <div>Device Type: Education Upgrade</div>
            <div>Auto Update Expiration: {device?.autoUpdateExpiration}</div>
          </div>
        </div>
        <MainContentFooter align="right">
          <Button />
        </MainContentFooter>
      </FadeIn>
    </MainContentInnerWrapper>
  );
}
