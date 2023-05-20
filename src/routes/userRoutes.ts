import { getAllUsers, getUser, createUser, updateUser, deleteUser } from '../controllers';
import { Router } from 'express';

const useRoutes = Router();

useRoutes.route('/').get(getAllUsers).post(createUser);
useRoutes.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default useRoutes;
