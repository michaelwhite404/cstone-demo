import axios, { AxiosError } from "axios";
import pluralize from "pluralize";
import { useCallback, useEffect, useState } from "react";
import { CheckoutLogModel } from "../../../src/types/models/checkoutLogTypes";
import { DeviceModel } from "../../../src/types/models/deviceTypes";
import { EmployeeModel } from "../../../src/types/models/employeeTypes";
import { ErrorLogModel } from "../../../src/types/models/errorLogTypes";
import { StudentModel } from "../../../src/types/models/studentTypes";
import {
  APIDeviceResponse,
  APIDevicesResponse,
  APIError,
  APIErrorLogResponse,
} from "../types/apiResponses";

export default function useDevice(deviceType: string, slug: string) {
  const [device, setDevice] = useState<DeviceModel>();
  const [checkouts, setCheckouts] = useState<CheckoutLogModel[]>([]);
  const [errors, setErrors] = useState<ErrorLogModel[]>([]);
  const [deviceLoaded, setDeviceLoaded] = useState(false);

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
  };

  const checkoutDevice = async (studentId: string) => {
    try {
      const res = await axios.post<APIDeviceResponse>(
        `/api/v2/devices/${device!._id}/check-out/student/${studentId}`
      );
      await getSingleDevice();
      return res.data.data.device;
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
  };

  const assignDevice = async (studentId: string) => {
    try {
      const res = await axios.post<APIDeviceResponse>(`/api/v2/devices/${device!._id}/assign`, {
        student: studentId,
      });
      await getSingleDevice();
      return res.data.data.device;
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
  };

  const unassignDevice = async () => {
    try {
      const res = await axios.post<APIDeviceResponse>(`/api/v2/devices/${device!._id}/unassign`);
      await getSingleDevice();
      return res.data.data.device;
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
  };

  const checkinDevice = async (data: any = {}) => {
    try {
      const res = await axios.post<APIDeviceResponse>(
        `/api/v2/devices/${device!._id}/check-in`,
        data
      );
      await getSingleDevice();
      return res.data.data.device;
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
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
    try {
      const res = await axios.post<APIErrorLogResponse>(
        `/api/v2/devices/${device?._id}/errors`,
        data
      );
      const fetchedDevice = await fetchDevice();
      return { errorLog: res.data.data.errorLog, device: fetchedDevice! };
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
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
    assignDevice,
    checkouts,
    errors,
    checkinDevice,
    deviceLoaded,
    updateableErrors,
    updateDeviceError,
    createDeviceError,
    resetDevice,
    unassignDevice,
  };
}

class Device {
  _id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  macAddress: string;
  status: "Available" | "Checked Out" | "Assigned" | "Broken" | "Not Available";
  slug: string;
  dueDate?: Date;
  checkedOut?: boolean;
  lastUser?: Pick<StudentModel, "_id" | "fullName" | "grade">;
  teacherCheckOut?: Pick<EmployeeModel, "_id" | "fullName" | "email">;
  lastCheckOut?: Date;
  lastCheckIn?: Date;
  checkouts?: CheckoutLogModel[];
  errorLogs?: ErrorLogModel[];
  directoryId?: string;
  constructor(device: DeviceModel) {
    this._id = device._id;
    this.name = device.name;
    this.brand = device.brand;
    this.model = device.model;
    this.serialNumber = device.serialNumber;
    this.macAddress = device.macAddress;
    this.status = device.status;
    this.slug = device.slug;
    this.dueDate = device.dueDate ? new Date(device.dueDate) : undefined;
    this.checkedOut = device.checkedOut;
    this.lastUser = {
      _id: device.lastUser._id,
      fullName: device.lastUser.fullName,
      grade: device.lastUser.grade,
    };
    this.teacherCheckOut = {
      _id: device.teacherCheckOut._id,
      fullName: device.teacherCheckOut.fullName,
      email: device.teacherCheckOut.email,
    };
    this.lastCheckOut = device.lastCheckOut ? new Date(device.lastCheckOut) : undefined;
    this.lastCheckIn = device.lastCheckIn ? new Date(device.lastCheckIn) : undefined;
    this.checkouts = device.checkouts;
    this.errorLogs = device.errorLogs;
    this.directoryId = device.directoryId;
  }

  private async fetchDevice() {
    try {
      const res = await axios.get<APIDevicesResponse>("/api/v2/devices", {
        params: {
          slug: this.slug,
          populate: "checkouts,errorLogs",
        },
      });
      const { devices } = res.data.data;
      return new Device(devices[0]);
    } catch {
      throw Error("No device found");
    }
  }

  async checkout(studentId: string) {
    try {
      await axios.post<APIDeviceResponse>(
        `/api/v2/devices/${this._id}/check-out/student/${studentId}`
      );
      await this.fetchDevice();
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
  }

  async checkin(data: any = {}) {
    try {
      await axios.post<APIDeviceResponse>(`/api/v2/devices/${this._id}/check-in`, data);
      await this.fetchDevice();
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
  }

  async assign(studentId: string): Promise<Device> {
    try {
      await axios.post<APIDeviceResponse>(`/api/v2/devices/${this._id}/assign`, {
        student: studentId,
      });
      return await this.fetchDevice();
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
  }

  /** Unassigns a user from a device  */
  async unassign() {
    axios
      .post<APIDeviceResponse>(`/api/v2/devices/${this._id}/unassign`)
      .then(() => this.fetchDevice())
      .catch((err) => {
        throw new Error((err as AxiosError<APIError>).response!.data.message);
      });
  }

  /**
   * Resets a device. Only works with chrome devices
   * @param action - Establishes the type of command the device must execute
   */
  reset(action: "wipe" | "powerwash") {
    axios.post(`/api/v2/devices/from-google/${device?.directoryId}/${action}`);
    return this;
  }
}

const device = new Device({} as DeviceModel);
/* const device2 =  */ device.reset("wipe");
