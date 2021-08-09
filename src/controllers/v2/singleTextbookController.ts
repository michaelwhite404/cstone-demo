import { NextFunction, Request, RequestHandler, Response } from "express";
import Student from "../../models/studentModel";
import TextbookLog from "../../models/textbookLogModel";
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

export const checkOutTextbook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!Array.isArray(req.body.books))
      return next(new AppError("An array of book ids must be in a 'book' property", 400));
    const bodyBooks = req.body.books as any[];
    const books = await Textbook.find({ _id: { $in: bodyBooks }, active: true }).populate({
      path: "textbookSet",
      select: "_id title",
    });
    // Make sure there are no invalid IDs
    const mappedBookIds = books.map((b) => b._id.toString());
    const badIds = bodyBooks.filter((b) => !mappedBookIds.includes(b));
    if (badIds.length > 0)
      return next(
        new AppError(`There are ${badIds.length} invalid book ids: ${badIds.join(", ")}`, 400)
      );
    // Make sure all textbooks are available
    const notAvailable = books.filter((b) => b.status !== "Available");
    if (notAvailable.length > 0) {
      const msgStart = notAvailable.length + ` book${notAvailable.length > 1 ? "s" : ""}`;
      return next(
        new AppError(
          `${msgStart} cannot be checked out: ${notAvailable
            .map((o) => o._id)
            .join(", ")}. Please check the status for each book.`,
          400
        )
      );
    }
    // Make sure student exists
    const student = await Student.findById(req.params.student_id).populate("textbooksCheckedOut");
    if (!student) return next(new AppError("There is no student with this ID", 404));
    // Student should not have multiple books from one textbook set
    const checkedSetIds = student.textbooksCheckedOut!.map((t) => t.textbookSet.toString());
    const invalidBooks = books.filter((b) => checkedSetIds.includes(b.textbookSet._id.toString()));
    if (invalidBooks.length > 0) {
      const problems = invalidBooks.map((b) => `${b.textbookSet.title} (${b._id})`).join(", ");
      const msg = `${student.fullName} already has a book from: ${problems}`;
      return next(new AppError(msg, 404));
    }
    /// GOOD TO GO
    await Textbook.updateMany(
      { _id: { $in: bodyBooks } },
      { status: "Checked Out", lastUser: req.params.student_id, teacherCheckOut: req.employee._id },
      { new: true }
    );

    const createLogs = books.map((b) => ({
      checkedIn: false,
      textbook: b._id,
      student: req.params.student_id,
      checkOutDate: new Date(req.requestTime),
      teacherCheckOut: req.employee._id,
      qualityOut: b.quality,
    }));

    const createdLogs = await TextbookLog.create(createLogs);
    const logs = await TextbookLog.populate(createdLogs, {
      path: "student teacherCheckOut textbook",
      select: "fullName textbookSet bookNumber",
    });
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: { logs },
    });
  }
);
