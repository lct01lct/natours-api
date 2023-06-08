import { ReviewModel } from '@/models/reviewModel';
import { catchAsync } from '@/utils';
import {
  GetAllReviewsApi,
  CreateReviewApi,
  DeleteReviewApi,
  UpdateReviewApi,
  GetReviewApi,
} from '@/apis';
import * as factory from './handlerFactory';
import { ModelFields, complex } from '@/models';

export const setTourUserIds = catchAsync<CreateReviewApi>(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
});

export const getAllReviews = factory.getAll<GetAllReviewsApi>(
  ReviewModel,
  complex(ModelFields.REVIRW)
);
export const getReview = factory.getOne<GetReviewApi>(ReviewModel, null, ModelFields.REVIRW);
export const createReview = factory.createOne<CreateReviewApi>(ReviewModel, ModelFields.REVIRW);
export const deleteReview = factory.deleteOne<DeleteReviewApi>(ReviewModel);
export const updateReview = factory.updateOne<UpdateReviewApi>(ReviewModel, ModelFields.REVIRW);
