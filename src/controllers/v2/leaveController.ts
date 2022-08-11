import { Leave } from "@models";
import { AppError, catchAsync } from "@utils";
import { handlerFactory as factory } from ".";

const Model = Leave;
const key = "leave";

export const getAllLeaves = factory.getAll(Model, key);

export const getLeave = factory.getOneById(Model, key);

export const approveLeave = catchAsync(async (req, res, next) => {
  // BODY: { approved: true } || { approved: false }
  const { approved } = req.body;
  if (approved === undefined || approved === null)
    return next(new AppError("Please set the property `approved` as a boolean value", 400));
  // If value not valid
  let value: boolean | undefined = undefined;
  new Set([true, "true", 1, "1", "yes"]).has(approved) && (value = true);
  new Set([false, "false", 0, "0", "no"]).has(approved) && (value = false);
  if (value === undefined)
    return next(new AppError("The property `approved` should be a boolean value", 400));
  // VALID
  const leave = await Leave.findById(req.params.id);
  if (!leave) return next(new AppError("There is no leave with this id", 404));
  if (leave.approval)
    return next(new AppError("This leave request has already been finalized", 400));
  leave.approval = {
    user: req.employee._id,
    date: new Date(req.requestTime),
    approved,
  };
  await leave.save();
  res.sendJson(200, { leave });
});

export const createLeave = catchAsync(async (req, res) => {
  const { dateStart, dateEnd, reason, comments } = req.body;
  const leave = await Model.create({
    user: req.employee._id,
    dateStart,
    dateEnd,
    reason,
    comments,
    createdAt: new Date(),
  });
  res.sendJson(201, { leave });
});
