import type { Express } from 'express';
import tourRoutes from './tourRoutes';

const initRoutes = (app: Express) => {
  app.use('/api/v1/tours', tourRoutes);
};

export default initRoutes;
