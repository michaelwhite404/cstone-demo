import { NextFunction, Request, RequestHandler, Response } from "express";
import { Types } from "mongoose";
import CheckoutLog from "../../models/checkoutLogModel";
import Device from "../../models/deviceModel";
import ErrorLog from "../../models/errorLogModel";
import { ErrorLogModel } from "../../types/models/errorLogTypes";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import * as factory from "./handlerFactory";

const Model = Device;
const key = "device";

/** `GET` - Gets all devices
 *  - All authorized users can access this route
 */
export const getAllDevices: RequestHandler = factory.getAll(Model, `${key}s`);
/** `GET` - Gets a single device
 *  - All authorized users can access this route
 */
export const getOneDevice: RequestHandler = factory.getOne(Model, key);
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
    const device = await Device.findById(req.params.id);
    // If no device
    if (!device) return next(new AppError("No device found with that ID", 404));
    // If Not Available
    if (device.status !== "Available")
      return next(new AppError(`This device is ${device.status.toLowerCase()}`, 400));
    // Device can be checked out
    device.checkedOut = true;
    device.status = "Checked Out";
    device.lastCheckOut = new Date(req.requestTime);
    device.lastUser = new Types.ObjectId(req.params.student_id);
    device.teacherCheckOut = new Types.ObjectId(req.employee!._id);

    // Save device
    await device.save({ validateBeforeSave: false });
    // Create checkout log
    await CheckoutLog.create({
      device: device._id,
      checkOutDate: req.requestTime,
      deviceUser: device.lastUser,
      teacherCheckOut: req.employee._id,
      checkedIn: false,
      dueDate: req.body.dueDate,
    });

    res.status(200).json({
      status: "success",
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
    data: {
      device,
    },
  });
});
