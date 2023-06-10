import { Router } from 'express';
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
} from '@/controllers';
import { protect, restrictTo } from '@/controllers/authControllers';
import reviewRouter from './reviewRoutes';

const tourRouter = Router();
// tourRouter.param('id', checkId);

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
tourRouter.route('/tours-within/:distance/latlng/:latlng/unit/:unit').get(getToursWithin);
tourRouter.route('/distances/:latlng/unit/:unit').get(getDistances);
tourRouter
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);
tourRouter
  .route('/')
  .get(protect, getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default tourRouter;
