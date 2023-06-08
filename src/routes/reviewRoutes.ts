import { deleteReview, getReview, protect, setTourUserIds, updateReview } from '@/controllers';
import { Router } from 'express';
import { getAllReviews, createReview, restrictTo } from '@/controllers';

const reviewRouter = Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user', 'admin'), setTourUserIds, createReview);

reviewRouter
  .route('/:id')
  .get(getReview)
  .delete(protect, deleteReview)
  .patch(protect, updateReview);

export default reviewRouter;
