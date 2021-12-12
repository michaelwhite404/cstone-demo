import { NextFunction, Request, RequestHandler, Response } from "express";
import TimesheetEntry from "../../models/timesheetEntryModel";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import datesAreOnSameDay from "../../utils/datesAreOnSameDay";

import * as factory from "./handlerFactory";

const Model = TimesheetEntry;
const key = "timesheetEntry";

/** `GET` - Gets all timesheet entries
 *  - TODO: Who can access this controller??
 */
export const getAllTimeSheetEntries: RequestHandler = factory.getAll(Model, key);

/** `GET` - Gets a timesheet entry
 *  - TODO: Who can access this controller??
 */
export const getOneTimeSheetEntry: RequestHandler = factory.getOneById(Model, key);

/** `POST` - Creates a new timesheet entry
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const createTimeSheetEntry = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.employee.timesheetEnabled)
      return next(new AppError("You are not authorized to create timesheet entries", 403));

    const timesheetEntry = await Model.create({
      employeeId: req.employee._id,
      timeStart: req.body.timeStart,
      timeEnd: req.body.timeEnd,
      description: req.body.description,
    });

    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        timesheetEntry,
      },
    });
  }
);
