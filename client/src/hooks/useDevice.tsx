import axios, { AxiosError } from "axios";
import { DeviceModel } from "../../../src/types/models/deviceTypes";
import { APIDeviceResponse, APIError } from "../types/apiResponses";
import useToasterContext from "./useToasterContext";

export default function useDevice(/* { device }: { device: string | DeviceModel } */) {
  // const id = typeof device === "string" ? device : device._id;
  const { showToaster } = useToasterContext();

  const checkoutDevice = async (device: DeviceModel, studentId: string) => {
    try {
      const res = await axios.post<APIDeviceResponse>(
        `/api/v2/devices/${device._id}/check-out/student/${studentId}`
      );
      showToaster(`${device.name} successfully checked out`, "success");
      return res.data.data.device;
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const checkinDevice = async () => {};

  return { checkoutDevice };
}
