import { deleteReview, protect, updateReview } from '@/controllers';
import { Router } from 'express';
import { getAllReviews, createReview, restrictTo } from '@/controllers';

const reviewRouter = Router({ mergeParams: true });

reviewRouter.route('/').get(getAllReviews).post(protect, restrictTo('user', 'admin'), createReview);

reviewRouter.route('/:id').delete(protect, deleteReview).patch(protect, updateReview);

export default reviewRouter;
