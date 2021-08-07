import { NextFunction, Request, RequestHandler, Response } from "express";
import Textbook from "../../models/textbookModel";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
// import catchAsync from "../../utils/catchAsync";
import * as factory from "./handlerFactory";

const Model = Textbook;
const key = "book";

/** `GET` - Gets all books
 *  - All authorized users can access this route
 */
export const getAllBooks: RequestHandler = factory.getAll(Model, `${key}s`);

export const getBook: RequestHandler = factory.getOne(Model, key);

export const createBook: RequestHandler = factory.createOne(Model, key);

export const updateBook: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.status === "Checked Out" || req.body.checkedOut)
      return next(new AppError("This route is not for checking in and out", 400));
    const oldDoc = await Model.findOne(req.params);
    if (!oldDoc) {
      return next(new AppError("No book found with that ID", 400));
    }
    if (oldDoc.status === "Checked Out")
      return next(new AppError("Checked out book cannot be updated", 400));
    const newDoc = await Model.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        book: newDoc,
      },
    });
  }
);
