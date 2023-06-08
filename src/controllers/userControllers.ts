import { UserModel } from '@/models';
import { AppError, catchAsync } from '@/utils';
import { GetAllUsersApi, UpdateUserApi, DeleteUserApi } from '@/apis';
import * as factory from './handlerFactory';

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

const getUserMiddleWare = catchAsync<{ params?: { id: string } }>(async (req, res, next) => {
  req.params.id = req.user.id;
});

const getUser = factory.getOne(UserModel);

const createUser = catchAsync(async (req, res) => {});

const updateUser = catchAsync<UpdateUserApi>(async (req, res, next) => {
  const { password, passwordConfrim } = req.body;

  if (password || passwordConfrim) {
    return next(
      new AppError('This route is not for password updates. Please use updatePassword Route', 400)
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  const newUser = await UserModel.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

const deleteUser = catchAsync<DeleteUserApi>(async (req, res, next) => {
  await UserModel.findByIdAndDelete(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
  });
});

function filterObj<Obj extends object, F extends keyof Obj>(obj: Obj, ...allowFields: F[]): object {
  const newObj = {} as Record<F, Obj[F]>;

  for (const field of allowFields) {
    if (obj[field]) newObj[field] = obj[field];
  }

  return newObj;
}

export { getUserMiddleWare, getAllUsers, getUser, createUser, updateUser, deleteUser };
