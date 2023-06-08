import { deleteReview, getReview, protect, setTourUserIds, updateReview } from '@/controllers';
import { Router } from 'express';
import { getAllReviews, createReview, restrictTo } from '@/controllers';

const reviewRouter = Router({ mergeParams: true });

reviewRouter.use(protect);

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user', 'admin'), setTourUserIds, createReview);

reviewRouter
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

export default reviewRouter;
