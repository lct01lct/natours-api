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
} from '@/controllers';
import { protect, restrictTo } from '@/controllers/authControllers';
import reviewRouter from './reviewRoutes';

const tourRouter = Router();
// tourRouter.param('id', checkId);

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);
tourRouter.route('/').get(protect, getAllTours).post(createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default tourRouter;
