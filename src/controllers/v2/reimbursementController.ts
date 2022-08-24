import { Reimbursement } from "@models";
import { AppError, catchAsync, s3 } from "@utils";
import { handlerFactory as factory } from ".";

const Model = Reimbursement;
const key = "reimbursement";

export const getAllReimbursements = factory.getAll(Model, key);

export const getReimbursement = factory.getOneById(Model, key);

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
  const reimbursement = await Reimbursement.findById(req.params.id);
  if (!reimbursement) return next(new AppError("There is no reimbursement with this id", 404));
  if (reimbursement.approval)
    return next(new AppError("This reimbursement request has already been finalized", 400));
  reimbursement.approval = {
    user: req.employee._id,
    date: new Date(req.requestTime),
    approved,
  };
  await reimbursement.save();
  res.sendJson(200, { reimbursement });
});

export const createReimbursement = catchAsync(async (req, res, next) => {
  const { date, amount, address, purpose, payee, specialInstructions, dateNeeded } = req.body;
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
