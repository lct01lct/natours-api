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
  GetToursWithinApi,
  GetDistanceApi,
} from '../apis';

import { AppError, catchAsync } from '@/utils';
import multer from 'multer';
import sharp from 'sharp';
import { join } from 'path';

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

export const getToursWithin = catchAsync<GetToursWithinApi>(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(new AppError('Please provide latitutr and longitude in the format lat,lng', 400));
  }

  const tours = await TourModel.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    data: {
      results: tours.length,
      tours,
    },
  });
});

export const getDistances = catchAsync<GetDistanceApi>(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const tuple = latlng.split(',');
  const lat = Number(tuple[0]);
  const lng = Number(tuple[1]);
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new AppError('Please provide latitutr and longitude in the format lat,lng.', 400));
  }

  const distances = await TourModel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      distances,
    },
  });
});

const upload = multer({
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, 'src/public/img/users');
  //   },
  //   filename: (req: FR_Req, file, cb) => {
  //     const ext = file.mimetype.split('/')[1];
  //     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  //   },
  // }),
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload onlt iamges.', 400) as null, false);
    }
  },
});

export const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

export const resizeTourIamges = catchAsync<{
  params: { id: string };
  body: { imageCover: string; images?: string[] };
}>(async (req, res, next) => {
  const files = req.files as Record<'imageCover' | 'images', Express.Multer.File[]>;
  if (!files.imageCover || !files.images) return next();

  const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  const imagePath = join(__dirname, './../public/img/tours/');
  await sharp(files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(imagePath + imageCoverFilename);
  req.body.imageCover = imageCoverFilename;

  const images: string[] = [];

  await Promise.all(
    files.images.map(async (item, i) => {
      const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(item.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(imagePath + fileName);
      images.push(fileName);
    })
  );
  req.body.images = images;

  next();
});
