import { Document } from "mongoose";
import { DeviceModel } from "./deviceTypes";
import { CheckoutLogModel } from "./checkoutLogTypes";

export interface ErrorLogModel {
  title: string;
  device: DeviceModel;
  checkInInfo?: CheckoutLogModel;
  description: string;
  updates: ErrorUpdate[];
  final: boolean;
  status: ErrorStatus;
  createdAt: Date;
}

type ErrorStatus = "Broken" | "In Repair" | "Fixed" | "Unfixable";

export interface ErrorUpdate {
  description: string;
  createdAt: Date;
  status: ErrorStatus;
}

export interface ErrorLogDocument extends ErrorLogModel, Document {}
