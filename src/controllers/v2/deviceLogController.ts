import { NextFunction, Request, RequestHandler, Response } from "express";
import CheckoutLog from "../../models/checkoutLogModel";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import * as factory from "./handlerFactory";

export const addDeviceToQuery: RequestHandler = (req, _, next) => {
  if (req.params.device) req.query.device = req.params.device;
  next();
};

/** `GET` - Gets all device logs
 *  - All authorized users can access this route
 */
export const getAllLogs = factory.getAll(CheckoutLog, "deviceLogs");

/** `GET` - Gets a single device log
 *  - All authorized users can access this route
 */
export const getOneLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let deviceLog = await CheckoutLog.findOne(req.params);

  if (!deviceLog) {
    return next(new AppError("No device log found", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      deviceLog,
    },
  });
});
