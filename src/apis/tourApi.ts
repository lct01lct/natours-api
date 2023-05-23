import type { Res, LimitFields } from '../types';
import type { Tour } from '../models/';

type BaseRes = {
  tour: Tour;
};

export type GetAllToursApi = {
  query: LimitFields & Partial<Tour>;
  res: Res<{
    results: number;
    tours: Tour[];
  }>;
};

export type CreateTourApi = {
  body: Tour;
  res: Res<BaseRes>;
};

export type GetTourApi = {
  params: {
    id: string;
  };
  res: Res<BaseRes>;
};

export type UpdateTourApi = {
  params: {
    id: string;
  };
  body: Partial<Tour>;
  res: Res<BaseRes>;
};

export type DeteleTourApi = {
  params: {
    id: string;
  };
  res: Res<null>;
};

export type GetTourStats = {
  res: Res<{
    stats: any[];
  }>;
};

export type GetMonthlyPlan = {
  params: {
    year: string;
  };
  res: Res<{
    results: number;
    plan: any[];
  }>;
};
