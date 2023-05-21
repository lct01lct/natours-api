import { Tour, TourModel } from '../models';
import { FR, LIMIT_FIELDS } from '../types';
import type {
  CreateTourApi,
  GetAllToursApi,
  GetTourApi,
  UpdateTourApi,
  DeteleTourApi,
} from '../apis';

export const getAllTours: FR<GetAllToursApi> = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    LIMIT_FIELDS.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = TourModel.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort(`-${'createdAt' as keyof Tour}`);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // exclude __v
    }

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 100);
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await TourModel.countDocuments();
      if (skip > numTours) throw new Error('This page does not exist');
    }

    const tours = await query;

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
