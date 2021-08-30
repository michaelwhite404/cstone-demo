"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.updateOne = exports.createOne = exports.getOne = exports.getOneById = exports.getAll = void 0;
const pluralize_1 = __importDefault(require("pluralize"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const camelCaseToText_1 = __importDefault(require("../../utils/camelCaseToText"));
const getAll = (Model, key, filter = {}, populate) => catchAsync_1.default(async (req, res) => {
    const query = Model.find(filter);
    if (populate)
        query.populate(populate);
    const features = new apiFeatures_1.default(query, req.query)
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
            [pluralize_1.default(key)]: docs,
        },
    });
});
exports.getAll = getAll;
const getOneById = (Model, key, popOptions) => catchAsync_1.default(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions)
        query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
        return next(new appError_1.default(`No ${camelCaseToText_1.default(key, true)} found with that ID`, 404));
    }
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            [key]: doc,
        },
    });
});
exports.getOneById = getOneById;
const getOne = (Model, key, popOptions) => catchAsync_1.default(async (req, res, next) => {
    let query = Model.findOne(req.params);
    if (popOptions)
        query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
        return next(new appError_1.default(`No ${camelCaseToText_1.default(key, true)} found`, 404));
    }
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            [key]: doc,
        },
    });
});
exports.getOne = getOne;
const createOne = (Model, key) => catchAsync_1.default(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            [key]: newDoc,
        },
    });
});
exports.createOne = createOne;
const updateOne = (Model, key) => catchAsync_1.default(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new appError_1.default(`No ${camelCaseToText_1.default(key, true)} found with that ID`, 404));
    }
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            [key]: doc,
        },
    });
});
exports.updateOne = updateOne;
const deleteOne = (Model, key) => catchAsync_1.default(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new appError_1.default(`No ${camelCaseToText_1.default(key, true)} found with that ID`, 404));
    }
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        message: `1 ${key} has been deleted`,
    });
});
exports.deleteOne = deleteOne;
