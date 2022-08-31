import { Department, Employee } from "@models";
import { Schema, Types, model, ObjectId } from "mongoose";
import FKHelper from "./helpers/foreignKeyHelper";

const departmentMemberSchema = new Schema({
  departmentId: {
    type: Types.ObjectId,
    ref: "Department",
    validate: {
      validator: async (id: ObjectId) => FKHelper(Department, id),
    },
    required: true,
  },
  memberId: {
    type: Types.ObjectId,
    ref: "Employee",
    validate: {
      validator: async (id: ObjectId) => FKHelper(Employee, id),
    },
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["LEADER", "MEMBER"],
  },
});

departmentMemberSchema.index({ departmentId: 1, memberId: 1 }, { unique: true });

const DepartmentMember = model("DepartmentMember", departmentMemberSchema);

export default DepartmentMember;
