import { UserModel, User, Role } from '@/models';
import { AppError, catchAsync, sendEmail } from '@/utils';
import {
  SignupApi,
  LoginApi,
  ForgotPasswordApi,
  ResetPasswordApi,
  UpdatePasswordApi,
  LogoutApi,
} from '@/apis';
import jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import type { Types } from 'mongoose';
import { FR_Res } from '@/types';
import { Res } from '@/types';

const signToken = (id: number | Types.ObjectId) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED_IN,
  });

export const signup = catchAsync<SignupApi>(async (req, res) => {
  const { email, password, passwordConfirm, name, role } = req.body;

  const newUser = await UserModel.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  sendToken(newUser, 201, res);
});

export const login = catchAsync<LoginApi>(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new AppError('Please provide email and password!', 400));

  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) return next(new AppError('Incorrect email or password', 401));

  const correct = await (user as User).correctPassword?.(user.password, password);

  if (!correct) return next(new AppError('Incorrect email or password', 401));

  sendToken(user, 200, res);
});

export const logout = catchAsync<LogoutApi>(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
});

export const protect = catchAsync(async (req, res, next) => {
  let token: string;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  if (typeof decoded === 'string') return next(new AppError('Jwt parse went wrong!', 401));
  const freshUser = await UserModel.findById(decoded.id);

  if (!freshUser)
    return next(new AppError('The user belonging to this token does no longer exist.', 401));

  const isChangePassword = freshUser.changedPasswordAfter(decoded.iat);

  if (isChangePassword) return next(new AppError('User recently changed password!', 401));

  req.user = freshUser as any;
  res.locals.user = freshUser;

  next();
});

export const isLoggedIn = catchAsync(async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      if (typeof decoded === 'string') return next(new AppError('Jwt parse went wrong!', 401));
      const freshUser = await UserModel.findById(decoded.id);

      if (!freshUser) return next(new AppError('', 401));

      const isChangePassword = freshUser.changedPasswordAfter(decoded.iat);

      if (isChangePassword) return next(new AppError('', 401));

      res.locals.user = freshUser;
    }
  } catch (e) {
    // console.log(e);
  } finally {
    next();
  }
});

export const restrictTo = (...roles: Role[]) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  });
};

export const forgotPassword = catchAsync<ForgotPasswordApi>(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfrim to ${resetURL}.\nIf your did't forget your password, please ignore this email!`;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token {valid for 10 min}',
    //   message,
    // });
  } catch (err) {
    user.passwordConfirm = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return new AppError('There was an error sending the email. Try again later!', 500);
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  });
});

export const resetPassword = catchAsync<ResetPasswordApi>(async (req, res, next) => {
  const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await UserModel.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});

export const updatePassword = catchAsync<UpdatePasswordApi>(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfrim } = req.body;
  const user = await UserModel.findById(req.user._id).select('+password');
  const isCorrectPassword = user.correctPassword(passwordCurrent, user.password);

  if (!isCorrectPassword) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = password;
  user.passwordConfirm = passwordConfrim;

  await user.save();

  sendToken(user, 200, res);
});

function sendToken<
  _Res extends FR_Res<{
    res: Res<{
      token: string;
      user: User;
    }>;
  }>
>(user: User, statusCode: number, res: _Res) {
  const token = signToken((user as any)._id);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRED_IN) * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production', // https
    httpOnly: true,
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
}
