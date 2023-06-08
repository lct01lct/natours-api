import {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserMiddleWare,
  restrictTo,
} from '@/controllers';
import { Router } from 'express';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgotPassword', forgotPassword);

userRouter.use(protect);

userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updatePassword', updatePassword);

userRouter.use(restrictTo('admin'));

userRouter.route('/').get(getAllUsers).post(createUser).patch(updateUser).delete(deleteUser);

userRouter.route('/:id').get(getUserMiddleWare, getUser);

export default userRouter;
