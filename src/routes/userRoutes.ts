import { signup } from '@/controllers/authControllers';
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from '../controllers';
import { Router } from 'express';

const userRouter = Router();

userRouter.post('/signup', signup);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
