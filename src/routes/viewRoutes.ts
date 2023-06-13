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

// Deprecated: for form action
viewRouter.get('/me', protect, getAccountPage);

viewRouter.get('/', isLoggedIn, getOverviewPage);
viewRouter.get('/overview', isLoggedIn, getOverviewPage);
viewRouter.get('/tour/:slug', isLoggedIn, protect, getTourPage);
viewRouter.get('/login', isLoggedIn, getLoginPage);

viewRouter.post('/submit-user-data', protect, updateUserData);

export default viewRouter;
