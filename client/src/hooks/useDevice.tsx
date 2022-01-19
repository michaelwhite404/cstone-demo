import axios, { AxiosError } from "axios";
import pluralize from "pluralize";
import { useCallback, useEffect, useState } from "react";
import { CheckoutLogModel } from "../../../src/types/models/checkoutLogTypes";
import { DeviceModel } from "../../../src/types/models/deviceTypes";
import { ErrorLogModel } from "../../../src/types/models/errorLogTypes";
import {
  APIDeviceResponse,
  APIDevicesResponse,
  APIError,
  APIErrorLogResponse,
} from "../types/apiResponses";
import useToasterContext from "./useToasterContext";

export default function useDevice(deviceType: string, slug: string) {
  const [device, setDevice] = useState<DeviceModel>();
  const [checkouts, setCheckouts] = useState<CheckoutLogModel[]>([]);
  const [errors, setErrors] = useState<ErrorLogModel[]>([]);
  const [deviceLoaded, setDeviceLoaded] = useState(false);

  const { showToaster } = useToasterContext();

  const getSingleDevice = useCallback(async () => {
    try {
      fetchDevice();
    } catch (err) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceType, slug]);

  useEffect(() => {
    setDeviceLoaded(false);
    getSingleDevice();
  }, [getSingleDevice]);

  const fetchDevice = async () => {
    const res = await axios.get<APIDevicesResponse>("/api/v2/devices", {
      params: {
        deviceType: pluralize.singular(deviceType),
        slug,
        populate: "checkouts,errorLogs",
      },
    });
    const { devices } = res.data.data;
    if (devices.length === 1) {
      const { checkouts, errorLogs, ...device } = devices[0];
      setDevice(device);
      if (checkouts) setCheckouts(checkouts);
      if (errorLogs) setErrors(errorLogs);
      setDeviceLoaded(true);
      return devices[0];
    }
    throw new Error("Device Not Found");
  };

  const checkoutDevice = async (studentId: string) => {
    try {
      const res = await axios.post<APIDeviceResponse>(
        `/api/v2/devices/${device!._id}/check-out/student/${studentId}`
      );
      showToaster(`${device!.name} successfully checked out`, "success");
      await getSingleDevice();
      return res.data.data.device;
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const checkinDevice = async (data: any = {}) => {
    try {
      const res = await axios.post<APIDeviceResponse>(
        `/api/v2/devices/${device!._id}/check-in`,
        data
      );
      showToaster(`${device!.name} successfully checked in`, "success");
      await getSingleDevice();
      return res.data.data.device;
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const updateDeviceError = async (
    errorId: string,
    data: { status: string; description: string }
  ) => {
    const res = await axios.patch<APIErrorLogResponse>(
      `/api/v2/devices/${device?._id}/errors/${errorId}`,
      data
    );
    const fetchedDevice = await fetchDevice();
    return { errorLog: res.data.data.errorLog, device: fetchedDevice! };
  };

  const createDeviceError = async (data: { title: string; description: string }) => {
    const res = await axios.post<APIErrorLogResponse>(
      `/api/v2/devices/${device?._id}/errors`,
      data
    );
    const fetchedDevice = await fetchDevice();
    return { errorLog: res.data.data.errorLog, device: fetchedDevice! };
  };

  const resetDevice = async (action: "wipe" | "powerwash") => {
    const res = await axios.post(`/api/v2/devices/from-google/${device?.directoryId}/${action}`);
    return res.data.data.message as string;
  };

  const updateableErrors = errors.filter((e) => !e.final);

  return {
    device,
    setDevice,
    checkoutDevice,
    checkouts,
    errors,
    checkinDevice,
    deviceLoaded,
    updateableErrors,
    updateDeviceError,
    createDeviceError,
    resetDevice,
  };
}
