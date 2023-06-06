import { ReviewModel } from '@/models/reviewModel';
import { catchAsync } from '@/utils';
import { GetAllReviewsApi, CreateReviewApi } from '@/apis';

export const getAllReviews = catchAsync<GetAllReviewsApi>(async (req, res) => {
  const reviews = await ReviewModel.find();

  res.status(200).json({
    status: 'success',
    data: {
      results: reviews.length,
      reviews,
    },
  });
});

export const createReview = catchAsync<CreateReviewApi>(async (req, res) => {
  const newReview = await ReviewModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
