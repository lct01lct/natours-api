import { AppError } from '@/utils';
import type { FR_Req, FR_Res } from '@/types';
import type { NextFunction } from 'express';

export const errorHandler = (err: AppError, req: FR_Req, res: FR_Res<null>, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message;

  res.status(statusCode).json({
    status,
    message,
  });
};
