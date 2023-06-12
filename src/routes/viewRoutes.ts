import { getIndexPage, getLoginPage, getOverviewPage, getTourPage, protect } from '@/controllers';
import { Router } from 'express';

const viewRouter = Router();

viewRouter.get('/', getOverviewPage);
viewRouter.get('/overview', getOverviewPage);
viewRouter.get('/tour/:slug', protect, getTourPage);
viewRouter.get('/login', getLoginPage);

export default viewRouter;
