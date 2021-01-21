const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const pluralize = require('pluralize');
const capitalize = require('capitalize');
const slugify = require('slugify');

const preCheck = (req) => {
  let key = "doc";
  let filter = {};
  if (req.params.id) filter._id = req.params.id 
  if (req.device) {
    filter.deviceType = req.device;
    key = req.device;
  }

  let info = {
    filter,
    key
  }

  return info
}


exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { filter, key } = preCheck(req);

    const doc = await Model.findOneAndDelete(filter);

    if (!doc) {
      return next(new AppError(`No ${key} found with that ID`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { filter, key } = preCheck(req);
    if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
    const doc = await Model.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${key} found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        [key]: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.device) req.body.deviceType = req.device;
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        [`new${capitalize(req.device) || "Doc"}`]: newDoc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { filter, key } = preCheck(req);

    let query = Model.findOne(filter);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${key || "document"} found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        [key]: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const { filter, key } = preCheck(req);
    
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .limitFields()
      .paginate();
    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: docs.length,
      data: {
        [pluralize(key)]: docs,
      },
    });
  });
