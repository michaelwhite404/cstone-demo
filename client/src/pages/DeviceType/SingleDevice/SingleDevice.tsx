import axios, { AxiosError } from "axios";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { DeviceModel } from "../../../../../src/types/models/deviceTypes";
import DeviceStatusBadge from "../../../components/Badges/DeviceStatusBagde";
import PageHeader from "../../../components/PageHeader";
import PaneHeader from "../../../components/PaneHeader/PaneHeader";
import { useDocTitle } from "../../../hooks";
import useClasses from "../../../hooks/useClasses";
import useToasterContext from "../../../hooks/useToasterContext";
import { APIDevicesResponse, APIError } from "../../../types/apiResponses";
import Checkin from "../Checkin";
import Checkout from "../Checkout";
import CheckoutHistory from "../CheckoutHistory";
import ErrorHistory from "../ErrorHistory";

interface SingleDeviceParams {
  deviceType: string;
  slug: string;
}

export default function SingleDevice() {
  useDocTitle("TODO");
  const { showToaster } = useToasterContext();
  const [device, setDevice] = useState<DeviceModel>();
  const {
    params: { deviceType, slug },
  } = useRouteMatch<SingleDeviceParams>();

  useEffect(() => {
    getSingleDevice();
    async function getSingleDevice() {
      try {
        const res = await axios.get<APIDevicesResponse>("/api/v2/devices", {
          params: {
            deviceType: pluralize.singular(deviceType),
            slug,
          },
        });
        const { devices } = res.data.data;
        if (devices.length === 1) setDevice(devices[0]);
      } catch (err) {
        showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
      }
    }
  }, [deviceType, showToaster, slug]);

  const onCheckoutSuccess = (device: DeviceModel) => {
    setDevice(device);
  };

  return (
    <div>
      {device && (
        <>
          <PageHeader text={device.name || ""}>
            <DeviceStatusBadge status={device.status} />
          </PageHeader>
          {/* <div className="device-pane">
          <PaneHeader>Basic Info</PaneHeader>
          <div className="basic-info-box-wrapper">
            {values.map((box) => (
              <DeviceBasicInfo heading={box.heading} value={box.value} key={box.heading} />
            ))}
          </div>
        </div>*/}
          {device.status === "Available" && (
            <div>
              <Checkout device={device} onCheckoutSuccess={onCheckoutSuccess} />
            </div>
          )}
          {/* 
        {device.status === "Checked Out" && (
          <div className="device-pane">
            <Checkin
              device={device}
              setSelectedDevice={setSelectedDevice}
              updateDevice={updateDevice}
              toasterRef={toasterRef}
            />
          </div>
        )} */}
          <div>
            <CheckoutHistory device={device} />
          </div>
          <div>
            <ErrorHistory device={device} />
          </div>
        </>
      )}
    </div>
  );
}
