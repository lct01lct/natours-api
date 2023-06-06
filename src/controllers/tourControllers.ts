import { TourModel } from '../models';
import { FR, FROptions, FROptionsDefault } from '../types';
import type {
  CreateTourApi,
  GetAllToursApi,
  GetTourApi,
  UpdateTourApi,
  DeteleTourApi,
  GetTourStats,
  GetMonthlyPlan,
} from '../apis';

import { APIFeatures, AppError, catchAsync } from '@/utils';

export const getAllTours = catchAsync<GetAllToursApi>(async (req, res) => {
  const features = new APIFeatures(TourModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      results: tours.length,
      tours: tours,
    },
  });
});

export const getTour = catchAsync<GetTourApi>(async (req, res, next) => {
  const tour = await TourModel.findById(req.params.id).populate('reviews');

  if (!tour) return next(new AppError('No tour found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

export const createTour = catchAsync<CreateTourApi>(async (req, res) => {
  const newTour = await TourModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

export const updateTour = catchAsync<UpdateTourApi>(async (req, res) => {
  const newTour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the modified data rather than original
    runValidators: true, // from model
  });

  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

export const deleteTour = catchAsync<DeteleTourApi>(async (req, res, next) => {
  const tour = await TourModel.findByIdAndDelete(req.params.id);

  if (!tour) return next(new AppError('No tour found with that ID', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const aliasTopTours = catchAsync<GetAllToursApi>(async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,pirce,ratingsAverage,summary,difficulty';
  next();
});

export const getTourStats = catchAsync<GetTourStats>(async (req, res) => {
  const stats = await TourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' },
    //   },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync<GetMonthlyPlan>(async (req, res) => {
  const year = Number(req.params.year);

  const plan = await TourModel.aggregate([
    // unconstruct by startDates
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 }, // delete _id
    },
    {
      $sort: { numToursStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { results: plan?.length ?? 0, plan },
  });
});
