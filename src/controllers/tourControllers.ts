import { TourModel } from '../models';
import { FR } from '../types';
import type {
  CreateTourApi,
  GetAllToursApi,
  GetTourApi,
  UpdateTourApi,
  DeteleTourApi,
} from '../apis';

import { APIFeatures } from '@/utils';

export const getAllTours: FR<GetAllToursApi> = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const getTour: FR<GetTourApi> = async (req, res) => {
  try {
    const tour = await TourModel.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const createTour: FR<CreateTourApi> = async (req, res) => {
  try {
    const newTour = await TourModel.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

export const updateTour: FR<UpdateTourApi> = async (req, res) => {
  try {
    const newTour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

export const deleteTour: FR<DeteleTourApi> = async (req, res) => {
  try {
    await TourModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

export const aliasTopTours: FR<GetAllToursApi> = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,pirce,ratingAverage,summary,difficulty';
  next();
};
