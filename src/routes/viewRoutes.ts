import { getIndexPage, getLoginPage, getOverviewPage, getTourPage } from '@/controllers';
import { Router } from 'express';

const viewRouter = Router();

viewRouter.get('/', getIndexPage);
viewRouter.get('/overview', getOverviewPage);
viewRouter.get('/tour/:slug', getTourPage);
viewRouter.get('/login', getLoginPage);

export default viewRouter;
