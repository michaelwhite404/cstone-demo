import { TicketDocument } from "@@types/models";
import { Model, model, ObjectId, Schema, Types } from "mongoose";
import FKHelper from "@models/helpers/foreignKeyHelper";
import { Department } from "@models";

const statusEnum = ["COMPLETE", "NOT_STARTED"];

const validDepartmentValidation = {
  validator: async (id: ObjectId) => FKHelper(Department, id),
};

const ticketSchema: Schema<TicketDocument, Model<TicketDocument>> = new Schema({
  title: {
    type: String,
    maxlength: 256,
    required: [true, "Each error must have a title"],
    immutable: true,
  },
  description: {
    type: String,
    required: [true, "Each ticket must have an description of the issue"],
    immutable: true,
  },
  department: {
    type: Types.ObjectId,
    ref: "Department",
    maxlength: 500,
    required: [true, "Each ticket must be associated with a department"],
    validate: [validDepartmentValidation],
  },
  status: {
    type: String,
    enum: statusEnum,
    required: [true, "Each ticket must have a status"],
  },
  priority: {
    type: String,
    enum: ["URGENT", "HIGH", "MEDIUM", "LOW"],
    required: [true, "Each ticket must have a priority level"],
  },
  submittedBy: {
    type: Types.ObjectId,
    ref: "Employee",
    required: [true, "Each ticket must be associated with a department"],
    immutable: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    required: true,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
    required: true,
  },
  updates: [
    {
      description: {
        type: String,
        maxlength: 500,
        required: [true, "Please describe the update to the device error"],
      },
      date: {
        type: Date,
        default: () => Date.now(),
      },
      status: {
        type: String,
        enum: statusEnum,
        required: [true, "Each ticket update must have a status"],
      },
    },
  ],
});

const Ticket = model("Ticket", ticketSchema);

export default Ticket;
