import { User } from '@/models';
import { FR, FROptions, FROptionsDefault, FR_Req, FR_Res } from '../types';
import type { NextFunction } from 'express';

export const catchAsync = <T extends FROptions = FROptionsDefault>(fn: FR<T>) => {
  return (req: FR_Req<T>, res: FR_Res<T>, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
