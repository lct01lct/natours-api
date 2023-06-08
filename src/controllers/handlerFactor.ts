import { AppError, catchAsync } from '@/utils';
import { Model, FilterQuery } from 'mongoose';
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
