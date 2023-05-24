import { FR, FROptions, FROptionsDefault } from '../types';
import type { Request, Response, NextFunction } from 'express';

export const catchAsync = <T extends FROptions = FROptionsDefault>(fn: FR<T>) => {
  return (
    req: Request<T['params'], never, T['body'], T['query']>,
    res: Response<T['res']>,
    next: NextFunction
  ) => {
    fn(req, res, next).catch(next);
  };
};
