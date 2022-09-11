import { Leave } from "@models";
import { APIFeatures, AppError, catchAsync, getUserLeaders } from "@utils";
import { handlerFactory as factory } from ".";

const Model = Leave;
const key = "leave";

export const getAllLeaves = catchAsync(async (req, res) => {
  const query = Model.find({
    $or: [{ sendTo: req.employee._id }, { user: req.employee._id }],
  }).populate([
    { path: "user sendTo", select: "fullName slug email" },
    { path: "approval", populate: { path: "user", select: "fullName email" } },
  ]);

  const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
  const leaves = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: leaves.length,
    data: {
      leaves,
    },
  });
});

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

export const createLeave = catchAsync(async (req, res, next) => {
  const { dateStart, dateEnd, reason, comments, sendTo } = req.body;
  // Is user leader
  const leaders = await getUserLeaders(req.employee);
  if (!leaders.map((l) => l._id.toString() as string).includes(sendTo)) {
    return next(
      new AppError("Please send your leave request to a person who leads your department", 400)
    );
  }

  let leave = await Model.create({
    user: req.employee._id,
    dateStart,
    dateEnd,
    reason,
    comments,
    sendTo,
    createdAt: new Date(),
  });
  leave = await Model.populate(leave, {
    path: "user sendTo",
    select: "fullName slug email",
  });
  res.sendJson(201, { leave });
});
