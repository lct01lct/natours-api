import { getIndexPage, getOverviewPage, getTourPage } from '@/controllers';
import { Router } from 'express';

const viewRouter = Router();

viewRouter.get('/', getIndexPage);
viewRouter.get('/overview', getOverviewPage);
viewRouter.get('/tour/:slug', getTourPage);

export default viewRouter;
