import type { Express } from 'express';
import tourRouter from './tourRoutes';

const initRoutes = (app: Express) => {
  app.use('/api/v1/tours', tourRouter);
};

export default initRoutes;
