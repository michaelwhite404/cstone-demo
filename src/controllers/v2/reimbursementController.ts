import { Reimbursement } from "@models";
import { ReimbursementDocument } from "@@types/models";
import { APIFeatures, AppError, catchAsync, s3 } from "@utils";
import { Query } from "mongoose";

const Model = Reimbursement;

export const getAllReimbursements = catchAsync(async (req, res) => {
  const query = Model.find({
    $or: [{ sendTo: req.employee._id }, { user: req.employee._id }],
  }).populate({ path: "user sendTo", select: "fullName slug email" });

  const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
  const reimbursements = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: reimbursements.length,
    data: {
      reimbursements,
    },
  });
});

export const getReimbursement = catchAsync(async (req, res) => {
  let query: Query<ReimbursementDocument | null, ReimbursementDocument, {}, ReimbursementDocument>;
  const leaderDepartments = req.employee.departments?.filter((d) => d.role === "EMPLOYEE");
  if (leaderDepartments && leaderDepartments.length > 0) {
    query = Model.findOne({
      $or: [
        { department: { $in: leaderDepartments.map((d) => d._id.toString()) }, _id: req.params.id },
        { user: req.employee._id, _id: req.params.id },
      ],
    });
  } else {
    query = Model.findOne({ user: req.employee._id, _id: req.params.id });
  }
  const reimbursement = await query.populate({
    path: "user sendTo",
    select: "fullName slug email",
  });

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      reimbursement,
    },
  });
});

export const checkCanApprove = catchAsync(async (req, res, next) => {
  const reimbursement = await Reimbursement.findById(req.params.id);
  if (!reimbursement) return next(new AppError("There is no reimbursement with this id", 404));
  if (reimbursement.sendTo.toString() !== req.employee._id.toString()) {
    return next(new AppError("You are not authorized to approve this reimbursement", 403));
  }
  if (reimbursement.approval)
    return next(new AppError("This reimbursement request has already been finalized", 400));
  res.locals.reimbursement;
  next();
});

export const approveReimbursement = catchAsync(async (req, res, next) => {
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
  const reimbursement = res.locals.reimbursement as ReimbursementDocument;

  reimbursement.approval = {
    user: req.employee._id,
    date: new Date(req.requestTime),
    approved,
  };
  await reimbursement.save();
  res.sendJson(200, { reimbursement });
});

export const createReimbursement = catchAsync(async (req, res, next) => {
  const { date, amount, address, purpose, payee, specialInstructions, dateNeeded, sendTo } =
    req.body;
  if (!(req.file?.fieldname === "receipt")) {
    return next(new AppError("Each reimbursement must have a receipt to upload", 400));
  }

  const reimbursement = await Model.create({
    user: req.employee._id,
    payee,
    date,
    amount,
    address,
    purpose,
    specialInstructions,
    dateNeeded,
    sendTo,
    createdAt: new Date(),
  });
  try {
    const fileKey = `receipts/${reimbursement._id}`;
    const { Key } = await s3.uploadFile(req.file, fileKey);
    reimbursement.receipt = `${req.protocol}://${req.headers.host}/images/${Key}`;
    await reimbursement.save();
  } catch (err) {
    await reimbursement.remove();
    throw err;
  }
  res.sendJson(201, { reimbursement });
});
