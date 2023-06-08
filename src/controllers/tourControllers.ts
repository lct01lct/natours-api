import { TourModel, ModelFields, complex } from '@/models';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory';
import type {
  CreateTourApi,
  GetAllToursApi,
  GetTourApi,
  UpdateTourApi,
  DeteleTourApi,
  GetTourStats,
  GetMonthlyPlan,
} from '../apis';

import { APIFeatures, catchAsync } from '@/utils';

export const getAllTours = getAll<GetAllToursApi>(TourModel, complex(ModelFields.TOUR));

export const getTour = getOne<GetTourApi>(TourModel, { path: 'reviews' }, ModelFields.TOUR);

export const createTour = createOne<CreateTourApi>(TourModel, ModelFields.TOUR);

export const updateTour = updateOne<UpdateTourApi>(TourModel, ModelFields.TOUR);

export const deleteTour = deleteOne<DeteleTourApi>(TourModel);

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
