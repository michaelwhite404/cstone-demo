import { Reimbursement } from "@models";
import { AppError, catchAsync, s3 } from "@utils";
import { handlerFactory as factory } from ".";

const Model = Reimbursement;
const key = "reimbursement";

export const getAllReimbursements = factory.getAll(Model, key);

export const createReimbursement = catchAsync(async (req, res, next) => {
  const { date, amount, address, purpose } = req.body;
  if (!(req.file?.fieldname === "receipt")) {
    return next(new AppError("Each reimbursement must have a receipt to upload", 400));
  }
  const reimbursement = await Model.create({
    user: req.employee._id,
    date,
    amount,
    address,
    purpose,
    createdAt: new Date(),
  });
  try {
    const fileKey = `receipts/${reimbursement._id}`;
    const { Key } = await s3.uploadFile(req.file, fileKey);
    reimbursement.receipt = `${req.protocol}://${req.headers.host}/images/${Key}`;
    reimbursement.save();
  } catch (err) {
    await reimbursement.remove();
    throw err;
  }
  res.sendJson(201, { reimbursement });
});
