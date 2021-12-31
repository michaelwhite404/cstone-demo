import { useParams, useRouteMatch } from "react-router-dom";
import { DeviceModel } from "../../../../../src/types/models/deviceTypes";
import DeviceStatusBadge from "../../../components/Badges/DeviceStatusBagde";
import PageHeader from "../../../components/PageHeader";
import PaneHeader from "../../../components/PaneHeader/PaneHeader";
import { useDevice, useDocTitle } from "../../../hooks";
// import useToasterContext from "../../../hooks/useToasterContext";
import Checkout from "../Checkout";
import CheckoutHistory from "../CheckoutHistory";
import ErrorHistory from "../ErrorHistory";

interface SingleDeviceParams {
  deviceType: string;
  slug: string;
}

export default function SingleDevice() {
  useDocTitle("TODO");
  // const { showToaster } = useToasterContext();
  const { deviceType, slug } = useParams<SingleDeviceParams>();
  const { device, setDevice, checkouts } = useDevice(deviceType, slug);

  const onCheckoutSuccess = (device: DeviceModel) => setDevice(device);

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
            <CheckoutHistory checkouts={checkouts} />
          </div>
          <div>
            <ErrorHistory device={device} />
          </div>
        </>
      )}
    </div>
  );
}
