import type { Express } from 'express';
import tourRouter from './tourRoutes';
import { AppError } from '@/utils';

const initRoutes = (app: Express) => {
  app.use('/api/v1/tours', tourRouter);
  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // tranform error
  });
};

export default initRoutes;
