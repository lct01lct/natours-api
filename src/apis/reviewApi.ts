import type { Res } from '../types';
import type { Review } from '@/models';

type BaseRes = {
  review: Review;
};

export interface GetAllReviewsApi {
  params: {
    tourId?: string;
  };
  res: Res<{
    reviews: Review[];
    results: number;
  }>;
}

export interface CreateReviewApi {
  params: {
    tourId?: string;
  };
  body: {
    tour?: string;
    user?: string;
  };

  res: Res<BaseRes>;
}

export interface DeleteReviewApi {
  params: { id: string };
}

export interface UpdateReviewApi {
  params: { id: string };
  res: Res<{ review: Review }>;
}
