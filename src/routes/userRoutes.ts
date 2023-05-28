import {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
} from '@/controllers/authControllers';
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from '../controllers';
import { Router } from 'express';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
