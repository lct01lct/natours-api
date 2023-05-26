import { UserModel } from '@/models';
import { catchAsync } from '@/utils';
import { GetAllUsersApi } from '@/apis';

const getAllUsers = catchAsync<GetAllUsersApi>(async (req, res) => {
  const users = await UserModel.find();

  res.status(200).json({
    status: 'success',
    data: {
      results: users.length,
      users,
    },
  });
});

const getUser = catchAsync(async (req, res) => {});

const createUser = catchAsync(async (req, res) => {});

const updateUser = catchAsync(async (req, res) => {});

const deleteUser = catchAsync(async (req, res) => {});

export { getAllUsers, getUser, createUser, updateUser, deleteUser };
