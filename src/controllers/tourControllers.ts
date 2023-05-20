import type { FR } from '@/types';
import { RequestParamHandler } from 'express';
import { GetTourApi } from '@/apis';

const getAllTours: FR<GetTourApi> = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { list: [], length: 10 },
  });
};

const getTour: FR = (req, res) => {
  res.send();
};

const createTour: FR = (req, res) => {
  res.send();
};

const updateTour: FR = (req, res) => {
  res.send();
};

const deleteTour: FR = (req, res) => {
  res.send();
};

const checkId: RequestParamHandler = (req, res, next, val) => {
  next();
};

export { getAllTours, getTour, createTour, updateTour, deleteTour, checkId };
