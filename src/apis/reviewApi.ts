import type { Res } from '../types';
import type { Review } from '@/models';

type BaseRes = {
  review: Review;
};

export interface GetAllReviewsApi {
  res: Res<{
    reviews: Review[];
    results: number;
  }>;
}

export interface CreateReviewApi {
  body: {};

  res: Res<BaseRes>;
}
