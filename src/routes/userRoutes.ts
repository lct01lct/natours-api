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
} from '@/controllers';
import { Router } from 'express';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', protect, resetPassword);
userRouter.patch('/updatePassword', protect, updatePassword);

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

userRouter.route('/:id').get(getUser);

export default userRouter;
