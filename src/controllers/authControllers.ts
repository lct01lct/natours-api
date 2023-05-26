import { UserModel } from '@/models';
import { catchAsync } from '@/utils';
import { SignupApi } from '@/apis';
import jwt from 'jsonwebtoken';

export const signup = catchAsync<SignupApi>(async (req, res, next) => {
  const body = req.body;

  const newUser = await UserModel.create({
    name: body.name,
    email: body.email,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED_IN,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      token,
    },
  });
});
