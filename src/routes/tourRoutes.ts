import { Router } from 'express';
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
} from '../controllers';

const tourRouter = Router();
// tourRouter.param('id', checkId);

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;
