import { Button, Toaster } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import capitalize from "capitalize";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import { APIError } from "../../types/apiResponses";
import { APIDeviceResponse } from "../../types/apiResponses";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import useClasses from "../../hooks/useClasses";

interface DeviceCheckoutProps {
  device: DeviceModel;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceModel | undefined>>;
  updateDevice: (id: string, newDevice: DeviceModel) => void;
  toasterRef: React.RefObject<Toaster>;
}

export default function Checkout({
  device,
  setSelectedDevice,
  updateDevice,
  toasterRef,
}: DeviceCheckoutProps) {
  const { GradeSelect, StudentSelect, studentPicked } = useClasses();

  const checkoutDevice = async () => {
    try {
      const res = await axios.post<APIDeviceResponse>(
        `/api/v2/devices/${device._id}/check-out/student/${studentPicked}`
      );
      const newDevice = res.data.data.device;
      setSelectedDevice(newDevice);
      updateDevice(device._id, newDevice);
      toasterRef.current!.show({
        message: `${device.name} successfully checked out`,
        intent: "success",
        icon: "tick",
      });
    } catch (err) {
      console.log((err as AxiosError<APIError>).response?.data);
    }
  };
  return (
    <div>
      <PaneHeader>Check Out</PaneHeader>
      <div className="flex space-between">
        <div className="device-checkout-box">
          <span style={{ fontWeight: 500, marginBottom: "6px" }}>Grade</span>
          <GradeSelect />
        </div>
        <div className="device-checkout-box">
          <span style={{ fontWeight: 500, marginBottom: "6px" }}>Student</span>
          <StudentSelect />
        </div>
        <div className="device-checkout-box button">
          <Button intent="primary" disabled={studentPicked === "-1"} onClick={checkoutDevice}>
            Check Out {capitalize(device.deviceType)}
          </Button>
        </div>
      </div>
    </div>
  );
}
