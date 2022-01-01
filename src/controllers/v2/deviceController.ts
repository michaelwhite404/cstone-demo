import { NextFunction, Request, RequestHandler, Response } from "express";
import { google } from "googleapis";
import { PopulateOptions, Types } from "mongoose";
import CheckoutLog from "../../models/checkoutLogModel";
import Device from "../../models/deviceModel";
import ErrorLog from "../../models/errorLogModel";
import Student from "../../models/studentModel";
import { ErrorLogModel } from "../../types/models/errorLogTypes";
import APIFeatures from "../../utils/apiFeatures";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import { googleAuthJWT } from "./authController";
import * as factory from "./handlerFactory";

const Model = Device;
const key = "device";
const pop = { path: "lastUser teacherCheckOut", select: "fullName grade email" };

/** `GET` - Gets all devices
 *  - All authorized users can access this route
 */
export const getAllDevices: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const query = Model.find({});
  const popArray: PopulateOptions[] = [pop];
  const queryPop = (req.query.populate as string)?.split(",") || [];
  queryPop.includes("checkouts") &&
    popArray.push({ path: "checkouts", populate: { path: "deviceUser", select: "fullName" } });
  queryPop.includes("errorLogs") && popArray.push({ path: "errorLogs" });
  query.populate(popArray);
  const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
  const devices = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: devices.length,
    data: {
      devices,
    },
  });
});
/** `GET` - Gets a single device
 *  - All authorized users can access this route
 */
export const getOneDevice: RequestHandler = factory.getOneById(Model, key, pop);
/** `POST` - Creates a new device
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const createDevice: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const device = await Device.create({
    name: req.body.name,
    brand: req.body.brand,
    model: req.body.model,
    serialNumber: req.body.serialNumber,
    macAddress: req.body.macAddress,
    directoryId: req.body.directoryId,
    deviceType: req.body.deviceType,
  });

  res.status(201).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      device,
    },
  });
});
/** `PATCH` - Updates a device
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const updateDevice: RequestHandler = factory.updateOne(Model, key);

/** `DELETE` - Deletes a device
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const deleteDevice: RequestHandler = factory.deleteOne(Model, "Device");

export const checkOutDevice: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const [device, student] = await Promise.all([
      Device.findById(req.params.id),
      Student.findById(req.params.student_id),
    ]);
    // If no device
    if (!device) return next(new AppError("No device found with that ID", 404));
    // If Not Available
    if (device.status !== "Available")
      return next(new AppError(`This device is ${device.status.toLowerCase()}`, 400));
    // No student
    if (!student) return next(new AppError("No student found with that ID", 404));

    // Device can be checked out
    device.checkedOut = true;
    device.status = "Checked Out";
    device.lastCheckOut = new Date(req.requestTime);
    device.lastUser = new Types.ObjectId(req.params.student_id);
    device.teacherCheckOut = new Types.ObjectId(req.employee!._id);
    device.dueDate = req.body.dueDate;

    // Save device
    await device.save({ validateBeforeSave: true });
    // Create checkout log
    await CheckoutLog.create({
      device: device._id,
      checkOutDate: req.requestTime,
      deviceUser: device.lastUser,
      teacherCheckOut: req.employee._id,
      checkedIn: false,
      dueDate: device.dueDate,
    });

    await Device.populate(device, pop);

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        device,
      },
    });
  }
);

export const checkInDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const device = await Device.findById(req.params.id);
  // If no Device
  if (!device) {
    return next(new AppError("No device found with that ID", 404));
  }

  // If Not Checked Out
  if (device.status !== "Checked Out") {
    return next(new AppError(`This device is ${device.status.toLowerCase()}`, 400));
  }

  device.checkedOut = false;
  device.lastCheckIn = new Date(req.requestTime);
  device.teacherCheckOut = undefined;
  device.dueDate = undefined;

  const log = await CheckoutLog.findOne({
    device: device._id,
    checkedIn: false,
  });

  // If error
  if (log) {
    log.checkInDate = new Date(req.requestTime);
    log.teacherCheckIn = req.employee!._id;
    log.checkedIn = true;

    if (req.body.error === true || req.body.error === "true") {
      const { title, description } = req.body;
      const errorData = {
        title,
        description,
        device: device._id,
        checkInInfo: log._id,
        createdAt: req.body.checkInDate,
      } as ErrorLogModel;
      const errorLog = await ErrorLog.create(errorData);
      log.error = errorLog._id;
      device.status = "Broken";
    } else {
      device.status = "Available";
    }

    await device.save({ validateBeforeSave: false });
    await log.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      device,
    },
  });
});

export const getAllDeviceTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await Device.aggregate([{ $group: { _id: "$deviceType" } }]);
  const types = result.map((r) => r._id);

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    types,
  });
});

export const getDevicesFromGoogle = catchAsync(async (req: Request, res: Response) => {
  const scopes = ["https://www.googleapis.com/auth/admin.directory.device.chromeos"];
  const admin = google.admin({
    version: "directory_v1",
    auth: googleAuthJWT(scopes, req.employee.email),
  });
  const result = await admin.chromeosdevices.list({
    customerId: process.env.GOOGLE_CUSTOMER_ID,
    projection: "BASIC",
  });

  const devices = result.data.chromeosdevices;
  res.status(200).json({
    devices,
  });
});

export const getOneDeviceFromGoogle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const scopes = ["https://www.googleapis.com/auth/admin.directory.device.chromeos"];
    const admin = google.admin({
      version: "directory_v1",
      auth: googleAuthJWT(scopes, process.env.GOOGLE_ADMIN_EMAIL),
    });

    try {
      const { data: device } = await admin.chromeosdevices.get({
        customerId: process.env.GOOGLE_CUSTOMER_ID,
        deviceId: req.params.id,
      });

      res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
          device,
        },
      });
    } catch (err) {
      return next(new AppError(err.response.data.error.message, 500));
    }
  }
);
