import { TourModel } from '@/models';
import { catchAsync } from '@/utils';

export const getIndexPage = catchAsync(async (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Jonas',
  });
});

export const getOverviewPage = catchAsync(async (req, res) => {
  const tours = await TourModel.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

export const getTourPage = catchAsync(async (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
});
