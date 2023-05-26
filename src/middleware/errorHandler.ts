import { AppError, logger } from '@/utils';
import type { FR_Req, FR_Res } from '@/types';
import type { NextFunction } from 'express';
import { Server } from 'http';
import type { CastError } from 'mongoose';

export const errorHandler = (err: AppError, req: FR_Req, res: FR_Res<null>, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let _err: any = err;
    let error: AppError;

    if (_err.name === 'CastError') error = handleCastErrorDB(_err);
    if (_err.code === 11000) error = handleDuplicateErrorDB(_err);
    if (_err.name === 'ValidationError') error = handleValidationErrorDB(_err);
    if (_err.name === 'JsonWebTokenError') error = handleJsonWebTokenError(_err);

    sendErrorProd(error, res);
  }
};

const sendErrorDev = (err: AppError, res: FR_Res<null>) => {
  const { status, message, stack } = err;

  res.status(err.statusCode).json({
    status,
    message,
    error: err,
    stack,
  });
};

const sendErrorProd = (err: AppError, res: FR_Res<null>) => {
  const { status, message, isOperational } = err;
  if (isOperational) {
    res.status(err.statusCode).json({
      status,
      message,
    });
  } else {
    logger.error(`Error: ${err}`);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = (err: any) => {
  return new AppError('Invalid token.Please log in again', 401);
};

export const handleUncaughtExpectionError = () => {
  process.on('uncaughtException', err => {
    logger.error('UNCAUGHT REJECTION');
    logger.error(err);
    process.exit(1); // 0 stands for a success, 1 stands for uncaught exception.
  });
};

export const handleUnhandledRejection = (server: Server) => {
  process.on('unhandledRejection', (err: any) => {
    logger.error('UNHNADLE REJECTION');
    logger.error(err);
    server.close(() => {
      process.exit(1); // 0 stands for a success, 1 stands for uncaught exception.
    });
  });
};
