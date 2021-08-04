import { Mongoose } from "mongoose";
import { NextFunction, Response } from "express";
import pluralize from "pluralize";
import { ExtractDocumentModel } from "../../types/extract";
import CustomRequest from "../../types/customRequest";
import APIFeatures from "../../utils/apiFeatures";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

export const getAll = <T extends Mongoose["Model"]>(
  Model: T,
  key: string,
  filter: Partial<ExtractDocumentModel<T>> = {}
) =>
  catchAsync(async (req: CustomRequest, res: Response) => {
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: docs.length,
      data: {
        [pluralize(key)]: docs,
      },
    });
  });

export const getOne = <T extends Mongoose["Model"]>(
  Model: T,
  key: string,
  popOptions?: { path: any; select?: any }
) =>
  catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${key} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        [key]: doc,
      },
    });
  });

export const createOne = (Model: Mongoose["Model"], key: string) =>
  catchAsync(async (req: CustomRequest, res: Response) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        [key]: newDoc,
      },
    });
  });

export const updateOne = (Model: Mongoose["Model"], key: string) =>
  catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${key} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        [key]: doc,
      },
    });
  });

export const deleteOne = (Model: Mongoose["Model"], key: string) =>
  catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No ${key} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      message: "",
    });
  });
