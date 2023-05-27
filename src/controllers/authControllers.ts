import { UserModel, User, Role } from '@/models';
import { AppError, catchAsync } from '@/utils';
import { SignupApi, LoginApi, ProtectApi } from '@/apis';
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';

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

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      token,
    },
  });
});

export const login = catchAsync<LoginApi>(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new AppError('Please provide email and password!', 400));

  const user = await UserModel.findOne({ email }).select('+password');

  const correct = await (user as User).correctPassword?.(user.password, password);

  if (!user || !correct) return next(new AppError('Incorrect email or password', 401));

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});

export const protect = catchAsync<ProtectApi>(async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  if (typeof decoded === 'string') return next(new AppError('Jwt parse went wrong!', 401));
  const freshUser = await UserModel.findById<User>(decoded.id);

  if (!freshUser)
    return next(new AppError('The user belonging to this token does no longer exist.', 401));

  const isChangePassword = freshUser.changedPasswordAfter(decoded.iat);

  if (isChangePassword) return next(new AppError('User recently changed password!', 401));

  req.user = freshUser;
  next();
});

export const restrictTo = (...roles: Role[]) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  });
};

export const forgotPassword = catchAsync(async (req, res, next) => {});

export const resetPassword = catchAsync(async (req, res, next) => {});
