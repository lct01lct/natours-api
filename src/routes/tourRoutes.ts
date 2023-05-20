import { Router } from 'express';
import { getAllTours, getTour, createTour, updateTour, deleteTour } from '../controllers';

const tourRoutes = Router();
// tourRoutes.param('id', checkId);
tourRoutes.route('/').get(getAllTours).post(createTour);
tourRoutes.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default tourRoutes;
