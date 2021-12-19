import { NextFunction, Request, RequestHandler, Response } from "express";
import TimesheetEntry from "../../models/timesheetEntryModel";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";

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
 *  - Only users with timesheet enabled can use this
 */
export const createTimeSheetEntry = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.employee.timesheetEnabled)
      return next(new AppError("You are not authorized to create timesheet entries", 403));

    const { employeeOf } = req.employee!;
    if (employeeOf) {
      const dept = employeeOf.find((dept) => dept._id.toString() === req.body.department);
      if (!dept) {
        next(new AppError("You are not a member of this department", 403));
      }
    }

    const timesheetEntry = await Model.create({
      employeeId: req.employee._id,
      timeStart: req.body.timeStart,
      timeEnd: req.body.timeEnd,
      department: req.body.department,
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

export const updateTimesheetEntry = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timesheetEntry = await TimesheetEntry.findById(req.params.id);

    if (!timesheetEntry) return next(new AppError("No timesheet entry found with that ID", 404));

    if (timesheetEntry.status === "Approved")
      return next(new AppError("Approved timesheet entries cannot be updated", 403));

    req.body.timeStart ? (timesheetEntry.timeStart = req.body.timeStart) : "";
    req.body.timeEnd ? (timesheetEntry.timeEnd = req.body.timeEnd) : "";
    req.body.description ? (timesheetEntry.description = req.body.description) : "";

    await timesheetEntry.save({ validateBeforeSave: true });

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        timesheetEntry,
      },
    });
  }
);

export const deleteTimesheetEntry = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timesheetEntry = await TimesheetEntry.findById(req.params.id);

    if (!timesheetEntry) return next(new AppError("No timesheet entry found with that ID", 404));

    if (timesheetEntry.status === "Approved")
      return next(new AppError("Approved timesheet entries cannot be deleted", 403));

    await timesheetEntry.remove();

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      message: "1 timesheet entry has been deleted",
    });
  }
);
