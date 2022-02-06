import { model, Schema, Types } from "mongoose";
import nanoid from "nanoid";
import { ShortUrlDocument } from "../types/models/shortUrlTypes";

const shortUrlSchema = new Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid.nanoid(8),
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: "Employee",
  },
});

const ShortUrl = model<ShortUrlDocument>("shortUrl", shortUrlSchema);

export default ShortUrl;
