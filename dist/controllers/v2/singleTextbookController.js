"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInTextbooks = exports.checkOutTextbooks = exports.checkInTextbookByStudent = exports.checkOutTextbookByStudent = exports.updateBook = exports.createBook = exports.getBook = exports.getAllBooks = void 0;
const mongoose_1 = require("mongoose");
const pluralize_1 = __importDefault(require("pluralize"));
const studentModel_1 = __importDefault(require("../../models/studentModel"));
const textbookLogModel_1 = __importDefault(require("../../models/textbookLogModel"));
const textbookModel_1 = __importDefault(require("../../models/textbookModel"));
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const factory = __importStar(require("./handlerFactory"));
var isPlainObject = require("lodash.isplainobject");
const Model = textbookModel_1.default;
const key = "book";
/** `GET` - Gets all books
 *  - All authorized users can access this route
 */
exports.getAllBooks = factory.getAll(Model, `${key}s`, {}, {
    path: "textbookSet lastUser",
});
exports.getBook = factory.getOne(Model, key);
exports.createBook = factory.createOne(Model, key);
exports.updateBook = catchAsync_1.default(async (req, res, next) => {
    if (req.body.status === "Checked Out" || req.body.checkedOut)
        return next(new appError_1.default("This route is not for checking in and out", 400));
    const oldDoc = await Model.findOne(req.params);
    if (!oldDoc) {
        return next(new appError_1.default("No book found with that ID", 400));
    }
    if (oldDoc.status === "Checked Out")
        return next(new appError_1.default("Checked out book cannot be updated", 400));
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
});
exports.checkOutTextbookByStudent = catchAsync_1.default(async (req, res, next) => {
    if (!Array.isArray(req.body.books))
        return next(new appError_1.default("An array of book ids must be in a 'books' property", 400));
    const bodyBooks = req.body.books;
    const [books, student] = await Promise.all([
        textbookModel_1.default.find({ _id: { $in: bodyBooks }, active: true }).populate({
            path: "textbookSet",
            select: "_id title",
        }),
        studentModel_1.default.findById(req.params.student_id).populate("textbooksCheckedOut"),
    ]);
    // Make sure there are no invalid IDs
    const mappedBookIds = books.map((b) => b._id.toString());
    const badIds = bodyBooks.filter((b) => !mappedBookIds.includes(b));
    if (badIds.length > 0)
        return next(new appError_1.default(`There are ${badIds.length} invalid book ids: ${badIds.join(", ")}`, 400));
    // Make sure all textbooks are available
    const notAvailable = books.filter((b) => b.status !== "Available");
    if (notAvailable.length > 0) {
        const msgStart = notAvailable.length + ` book${notAvailable.length > 1 ? "s" : ""}`;
        return next(new appError_1.default(`${msgStart} cannot be checked out: ${notAvailable
            .map((o) => o._id)
            .join(", ")}. Please check the status for each book.`, 400));
    }
    // Make sure student exists
    if (!student)
        return next(new appError_1.default("There is no student with this ID", 404));
    // Student should not have multiple books from one textbook set
    const checkedSetIds = student.textbooksCheckedOut.map((t) => t.textbookSet.toString());
    const invalidBooks = books.filter((b) => checkedSetIds.includes(b.textbookSet._id.toString()));
    if (invalidBooks.length > 0) {
        const problems = invalidBooks.map((b) => `${b.textbookSet.title} (${b._id})`).join(", ");
        const msg = `${student.fullName} already has a book from: ${problems}`;
        return next(new appError_1.default(msg, 404));
    }
    /// GOOD TO GO
    await textbookModel_1.default.updateMany({ _id: { $in: bodyBooks } }, { status: "Checked Out", lastUser: req.params.student_id, teacherCheckOut: req.employee._id }, { new: true });
    const createLogs = books.map((b) => ({
        checkedIn: false,
        textbook: b._id,
        student: req.params.student_id,
        checkOutDate: new Date(req.requestTime),
        teacherCheckOut: req.employee._id,
        qualityOut: b.quality,
    }));
    await textbookLogModel_1.default.create(createLogs);
    res.status(201).json({
        status: "success",
        requestedAt: req.requestTime,
        message: `${student.fullName} checked out ${pluralize_1.default("textbook", bodyBooks.length, true)}`,
    });
});
exports.checkInTextbookByStudent = catchAsync_1.default(async (req, res, next) => {
    let errMsg;
    if (!Array.isArray(req.body.books)) {
        errMsg =
            "An array of book ids must be in a 'books' property. Each index in the array should have an object with an `(id)` property for the id of the textbook and a `(quality)` property for the quality of each textbook";
        return next(new appError_1.default(errMsg, 400));
    }
    // Check if each array index has an object with `id` and `quality`
    if (!allHaveIdandQuality(req.body.books)) {
        errMsg =
            "Each index in the array should have an object with an `(id)` property for the id of the textbook and a `(quality)` property for the quality of each textbook, which must be: Excellent, Good, Acceptable, or Poor";
        return next(new appError_1.default(errMsg, 400));
    }
    const bodyBooks = req.body.books;
    // Make sure student exists
    const student = await studentModel_1.default.findById(req.params.student_id)
        .populate("textbooksCheckedOut")
        .select("_id fullName textbooksCheckedOut");
    if (!student)
        return next(new appError_1.default("There is no student with this ID", 404));
    // Get checked out book IDs
    const checkedOutBooksIds = student.textbooksCheckedOut.map((t) => t._id.toString());
    // Get ids not checked out
    const idsNotCheckedOut = bodyBooks.filter((b) => !checkedOutBooksIds.includes(b.id));
    if (idsNotCheckedOut.length > 0) {
        errMsg = `${student.fullName} has not checked out books with these ids: ${idsNotCheckedOut
            .map((b) => b.id)
            .join(", ")}`;
        return next(new appError_1.default(errMsg, 400));
    }
    // Good to go
    const textbookBulkArr = bodyBooks.map((book) => ({
        updateOne: {
            filter: { _id: new mongoose_1.Types.ObjectId(book.id) },
            update: { status: "Available", quality: book.quality },
        },
    }));
    await textbookModel_1.default.bulkWrite(textbookBulkArr);
    const logBulkArr = bodyBooks.map((book) => ({
        updateOne: {
            filter: {
                textbook: new mongoose_1.Types.ObjectId(book.id),
                checkedIn: false,
            },
            update: {
                checkedIn: true,
                checkInDate: new Date(req.requestTime),
                teacherCheckIn: req.employee._id,
                qualityIn: book.quality,
            },
        },
    }));
    await textbookLogModel_1.default.bulkWrite(logBulkArr);
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        message: `${student.fullName} checked in ${pluralize_1.default("textbook", bodyBooks.length, true)}`,
    });
});
exports.checkOutTextbooks = catchAsync_1.default(async (req, res, next) => {
    // Data must be an array
    if (!Array.isArray(req.body.data))
        return next(new appError_1.default("The 'data' property must be an array", 400));
    const { data } = req.body;
    // Each item in the array must be an object with 'book' and 'student'
    if (data.every((value) => !(isPlainObject(value) && value.book && value.student))) {
        return next(new appError_1.default("Each index in the 'data' array must be an object with a 'book' and a 'student' value", 400));
    }
    // Get book ids
    const bookIds = data.map((obj) => obj.book);
    // No book duplicates
    if (checkIfDuplicateExists(bookIds))
        return next(new appError_1.default("All book values must be unique", 400));
    // Remove student duplicates
    const studentIds = [...new Set(data.map((obj) => obj.student))];
    // Get books and students
    const [books, students] = await Promise.all([
        textbookModel_1.default.find({ _id: { $in: bookIds }, active: true }).populate({
            path: "textbookSet",
            select: "_id title",
        }),
        studentModel_1.default.find({ _id: { $in: studentIds }, status: "Active" }).populate("textbooksCheckedOut"),
    ]);
    // Make sure all book ids are valid
    const returnedBooksIds = books.map((b) => b._id.toString());
    const invalidBooks = notInArray(returnedBooksIds, bookIds);
    if (invalidBooks.length > 0)
        return next(new appError_1.default(`There are ${invalidBooks.length} invalid book ids: ${invalidBooks.join(", ")}`, 400));
    // All books can be checked out
    const notAvailable = books.filter((b) => b.status !== "Available");
    if (notAvailable.length > 0) {
        const msgStart = notAvailable.length + ` book${notAvailable.length > 1 ? "s" : ""}`;
        return next(new appError_1.default(`${msgStart} cannot be checked out: ${notAvailable
            .map((o) => `${o.textbookSet.title} (Book ${o.bookNumber})`)
            .join(", ")}. Please check the status for each book.`, 400));
    }
    // Students are valid
    const returnedStudentIds = students.map((s) => s._id.toString());
    const invalidStudents = notInArray(returnedStudentIds, studentIds);
    if (invalidStudents.length > 0)
        return next(new appError_1.default(`There are ${invalidStudents.length} invalid student ids: ${invalidStudents.join(", ")}`, 400));
    // TODO: Student textbook set restriction
    // GOOD TO GO !!
    const getBook = (id) => books.find((book) => book._id.toString() === id);
    // Update textbooks' propertirs
    const textbookBulkArr = data.map((obj) => ({
        updateOne: {
            filter: { _id: new mongoose_1.Types.ObjectId(obj.book) },
            update: {
                status: "Checked Out",
                lastUser: obj.student,
                teacherCheckOut: req.employee._id,
            },
        },
    }));
    // Create logs
    const createLogs = data.map((obj) => ({
        checkedIn: false,
        textbook: obj.book,
        student: obj.student,
        checkOutDate: new Date(req.requestTime),
        teacherCheckOut: req.employee._id,
        qualityOut: getBook(obj.book).quality,
    }));
    await Promise.all([textbookModel_1.default.bulkWrite(textbookBulkArr), textbookLogModel_1.default.create(createLogs)]);
    //-------------
    const hasOrHave = (num) => (num > 1 ? "have" : "has");
    res.status(200).json({
        status: "sucess",
        message: `${pluralize_1.default("textbooks", data.length, true)} ${hasOrHave(data.length)} been checked out`,
    });
});
exports.checkInTextbooks = catchAsync_1.default(async (req, res, next) => {
    let errMsg;
    if (!Array.isArray(req.body.books)) {
        errMsg =
            "An array of book ids must be in a 'books' property. Each index in the array should have an object with an `(id)` property for the id of the textbook and a `(quality)` property for the quality of each textbook";
        return next(new appError_1.default(errMsg, 400));
    }
    // Check if each array index has an object with `id` and `quality`
    if (!allHaveIdandQuality(req.body.books)) {
        errMsg =
            "Each index in the array should have an object with an `(id)` property for the id of the textbook and a `(quality)` property for the quality of each textbook, which must be: Excellent, Good, Acceptable, or Poor";
        return next(new appError_1.default(errMsg, 400));
    }
    const data = req.body.books;
    // HANDLE REST ON FRONT END
    // Update Textbooks
    const textbookBulkArr = data.map((book) => ({
        updateOne: {
            filter: { _id: new mongoose_1.Types.ObjectId(book.id) },
            update: { status: "Available", quality: book.quality },
        },
    }));
    // Update Logs
    const logBulkArr = data.map((book) => ({
        updateOne: {
            filter: {
                textbook: new mongoose_1.Types.ObjectId(book.id),
                checkedIn: false,
            },
            update: {
                checkedIn: true,
                checkInDate: new Date(req.requestTime),
                teacherCheckIn: req.employee._id,
                qualityIn: book.quality,
            },
        },
    }));
    await textbookModel_1.default.bulkWrite(textbookBulkArr);
    await textbookLogModel_1.default.bulkWrite(logBulkArr);
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        message: `${pluralize_1.default("textbook", data.length, true)} checked in!`,
    });
});
const allHaveIdandQuality = (array) => {
    return (array.filter((obj) => {
        // Index must be an object
        if (!(typeof obj === "object" || obj !== null || !Array.isArray(obj)))
            return true;
        // Id must be a string
        if (typeof obj.id !== "string")
            return true;
        // Quality be a a TextbookQuality type
        if (!["Excellent", "Good", "Acceptable", "Poor"].includes(obj.quality))
            return true;
        return false;
    }).length === 0);
};
const checkIfDuplicateExists = (arr) => {
    return new Set(arr).size !== arr.length;
};
/**
 *
 * @param target The array of values being checked against
 * @param arr The array of values being tested
 * @returns The values in the second argument that are not in the first
 */
const notInArray = (target, arr) => {
    return arr.filter((value) => !target.includes(value));
};
