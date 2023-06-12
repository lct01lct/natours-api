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

export const getTourPage = catchAsync<{ params: { slug: string } }>(async (req, res) => {
  const tour = await TourModel.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

export const getLoginPage = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});
