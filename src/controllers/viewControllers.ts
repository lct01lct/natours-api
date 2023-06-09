import { TourModel, UserModel } from '@/models';
import { AppError, catchAsync } from '@/utils';

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

export const getTourPage = catchAsync<{ params: { slug: string } }>(async (req, res, next) => {
  const tour = await TourModel.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) return next(new AppError('There is no tour with that name', 404));

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

export const getAccountPage = catchAsync(async (req, res) => {
  res.status(200).render('account', { title: 'Your account' });
});

export const updateUserData = catchAsync<{ body: { name: string; email: string } }>(
  async (req, res) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).render('account', {
      title: 'Your account',
      user: updatedUser,
    });
  }
);
