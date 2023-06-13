import {
  getLoginPage,
  getOverviewPage,
  getTourPage,
  isLoggedIn,
  protect,
  getAccountPage,
  updateUserData,
} from '@/controllers';
import { Router } from 'express';

const viewRouter = Router();

viewRouter.get('/me', protect, getAccountPage);

viewRouter.use(isLoggedIn);

viewRouter.get('/', getOverviewPage);
viewRouter.get('/overview', getOverviewPage);
viewRouter.get('/tour/:slug', protect, getTourPage);
viewRouter.get('/login', getLoginPage);

viewRouter.post('/submit-user-data', protect, updateUserData);

export default viewRouter;
