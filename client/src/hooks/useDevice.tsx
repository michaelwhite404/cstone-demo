import axios, { AxiosError } from "axios";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { DeviceModel } from "../../../src/types/models/deviceTypes";
import { APIDeviceResponse, APIDevicesResponse, APIError } from "../types/apiResponses";
import useToasterContext from "./useToasterContext";

export default function useDevice(deviceType: string, slug: string) {
  const [device, setDevice] = useState<DeviceModel>();
  const { showToaster } = useToasterContext();

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
      } catch (err) {}
    }
  }, [deviceType, showToaster, slug]);

  const checkoutDevice = async (studentId: string) => {
    try {
      const res = await axios.post<APIDeviceResponse>(
        `/api/v2/devices/${device!._id}/check-out/student/${studentId}`
      );
      showToaster(`${device!.name} successfully checked out`, "success");
      return res.data.data.device;
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const checkinDevice = async () => {};

  return { device, setDevice, checkoutDevice };
}
