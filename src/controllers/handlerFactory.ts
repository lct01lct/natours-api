import { APIFeatures, AppError, catchAsync } from '@/utils';
import { Model, PopulateOptions } from 'mongoose';
import { FROptions } from '@/types';

export const deleteOne = <API extends FROptions>(Model: Model<any>) => {
  return catchAsync<API>(async (req, res, next) => {
    const doc = await Model.findOneAndDelete(req.params.id);

    if (!doc) return next(new AppError('No Document found with that ID', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

export const updateOne = <API extends FROptions>(Model: Model<any>, docField = 'data') => {
  return catchAsync<API>(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the modified data rather than original
      runValidators: true, // from model
    });

    if (!doc) return next(new AppError('No Document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        [docField]: doc,
      },
    });
  });
};

export const createOne = <API extends FROptions>(Model: Model<any>, docField = 'data') => {
  return catchAsync<API>(async (req, res) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        [docField]: doc,
      },
    });
  });
};

export const getOne = <API extends FROptions>(
  Model: Model<any>,
  popOptions: PopulateOptions | (PopulateOptions | string)[] | void,
  docField = 'data'
) => {
  return catchAsync<API>(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) return next(new AppError('No Document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        [docField]: doc,
      },
    });
  });
};

export const getAll = <API extends FROptions>(Model: Model<any>, docField = 'data') => {
  return catchAsync<API>(async (req, res) => {
    const filter: { tour?: string } = {};
    if (req.params.tourId) filter.tour = req.params.tourId;

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      data: {
        results: doc.length,
        [docField]: doc,
      },
    });
  });
};
