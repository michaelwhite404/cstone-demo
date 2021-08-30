"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.getOne = exports.createOne = exports.updateOne = exports.deleteOne = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const pluralize_1 = __importDefault(require("pluralize"));
const slugify_1 = __importDefault(require("slugify"));
const preCheck = (req) => {
    // Init
    let key = "doc";
    let filter = {};
    if (req.params) {
        filter = { ...req.params };
        if (filter.id) {
            filter._id = filter.id;
            delete filter.id;
        }
    }
    if (req.device) {
        filter.deviceType = req.device;
        key = req.device;
    }
    if (req.key)
        key = req.key;
    let info = {
        filter,
        key,
    };
    return info;
};
const deleteOne = (Model) => catchAsync_1.default(async (req, res, next) => {
    const { filter, key } = preCheck(req);
    const doc = await Model.findOneAndDelete(filter);
    if (!doc) {
        return next(new appError_1.default(`No ${key} found with that ID`, 404));
    }
    res.status(204).json({
        status: "success",
        requestedAt: Date(),
        data: null,
    });
});
exports.deleteOne = deleteOne;
const updateOne = (Model) => catchAsync_1.default(async (req, res, next) => {
    const { filter, key } = preCheck(req);
    if (req.body.name)
        req.body.slug = slugify_1.default(req.body.name, { lower: true });
    const doc = await Model.findOneAndUpdate(filter, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new appError_1.default(`No ${key} found with that ID`, 404));
    }
    res.status(200).json({
        status: "success",
        requestedAt: Date(),
        data: {
            [key]: doc,
        },
    });
});
exports.updateOne = updateOne;
const createOne = (Model) => catchAsync_1.default(async (req, res) => {
    if (req.device)
        req.body.deviceType = req.device;
    const newDoc = await Model.create(req.body);
    res.status(201).json({
        status: "success",
        requestedAt: Date(),
        data: {
            [`${req.device || "doc"}`]: newDoc,
        },
    });
});
exports.createOne = createOne;
const getOne = (Model, popOptions) => catchAsync_1.default(async (req, res, next) => {
    const { filter, key } = preCheck(req);
    let query = Model.findOne(filter);
    if (popOptions)
        query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
        return next(new appError_1.default(`No ${key || "document"} found with that ID`, 404));
    }
    res.status(200).json({
        status: "success",
        requestedAt: Date(),
        data: {
            [key]: doc,
        },
    });
});
exports.getOne = getOne;
const getAll = (Model) => catchAsync_1.default(async (req, res) => {
    const { filter, key } = preCheck(req);
    const features = new apiFeatures_1.default(Model.find(filter), req.query)
        .filter()
        .limitFields()
        .sort()
        .paginate();
    const docs = await features.query;
    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        requestedAt: Date(),
        results: docs.length,
        data: {
            [pluralize_1.default(key)]: docs,
        },
    });
});
exports.getAll = getAll;
