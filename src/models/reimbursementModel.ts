import { model, Schema, Types } from "mongoose";

const reimbursementSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: (amount: number) => Number.isInteger(amount),
      message: "`amount` must be an integer",
    },
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
  purpose: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  receipt: {
    type: String,
  },
  approval: {
    user: {
      type: Types.ObjectId,
      ref: "Employee",
      // required: true,
    },
    date: {
      type: Date,
    },
    approved: {
      type: Boolean,
      // required: true,
    },
  },
});

const Reimbursement = model("Reimbursement", reimbursementSchema);

export default Reimbursement;
