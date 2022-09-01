import { model, Schema, SchemaDefinition, SchemaTypeOptions } from "mongoose";
import { DepartmentDocument } from "@@types/models";

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    } as SchemaTypeOptions<string>,
  } as SchemaDefinition,
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

departmentSchema.virtual("membersCount", {
  ref: "DepartmentMember",
  foreignField: "department",
  localField: "_id",
  count: true,
});

departmentSchema.virtual("members", {
  ref: "DepartmentMember",
  foreignField: "department",
  localField: "_id",
});

const Department = model<DepartmentDocument>("Department", departmentSchema);

export default Department;
