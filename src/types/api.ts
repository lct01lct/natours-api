import type { Request, Response, NextFunction } from 'express';

interface FROptions {
  params?: any;
  body?: any;
  query?: any;
  res?: any;
}

type FROptionsDefault = Required<Record<keyof FROptions, never>>;

export type FR<T extends FROptions = FROptionsDefault> = (
  req: Request<T['params'], never, T['body'], T['query']>,
  res: Response<T['res']>,
  next?: NextFunction
) => void;
