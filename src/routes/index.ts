import type { Express } from 'express';
import tourRouter from './tourRoutes';
import userRouter from './userRoutes';
import reviewRouter from './reviewRoutes';
import viewRouter from './viewRoutes';
import { AppError } from '@/utils';

const initRoutes = (app: Express) => {
  app.use('/', viewRouter);
  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/reviews', reviewRouter);
  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  });
};

export default initRoutes;
