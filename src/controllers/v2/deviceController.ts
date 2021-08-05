import { Request, RequestHandler, Response } from "express";
import Device from "../../models/deviceModel";
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
