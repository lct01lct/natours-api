import { protect } from '@/controllers';
import { Router } from 'express';
import { getAllReviews, createReview, restrictTo } from '@/controllers';

const reviewRouter = Router();

reviewRouter.route('/').get(getAllReviews).post(protect, restrictTo('user', 'admin'), createReview);

reviewRouter.route('/:id').get(protect);

export default reviewRouter;
