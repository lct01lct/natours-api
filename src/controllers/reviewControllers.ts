import { ReviewModel } from '@/models/reviewModel';
import { catchAsync } from '@/utils';
import { GetAllReviewsApi, CreateReviewApi, DeleteReviewApi, UpdateReviewApi } from '@/apis';
import { deleteOne, updateOne } from './handlerFactor';

export const getAllReviews = catchAsync<GetAllReviewsApi>(async (req, res) => {
  const filter: { tour?: string } = {};
  if (req.params.tourId) filter.tour = req.params.tourId;

  const reviews = await ReviewModel.find(filter);

  res.status(200).json({
    status: 'success',
    data: {
      results: reviews.length,
      reviews,
    },
  });
});

export const createReview = catchAsync<CreateReviewApi>(async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await ReviewModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

export const deleteReview = deleteOne<DeleteReviewApi>(ReviewModel);

export const updateReview = updateOne<UpdateReviewApi>(ReviewModel, 'review');
