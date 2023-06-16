import { UserModel } from '@/models';
import { AppError, catchAsync } from '@/utils';
import { GetAllUsersApi, UpdateUserApi, DeleteUserApi } from '@/apis';
import * as factory from './handlerFactory';
import multer from 'multer';
import { FR_Req } from '@/types';

export const getAllUsers = catchAsync<GetAllUsersApi>(async (req, res) => {
  const users = await UserModel.find();

  res.status(200).json({
    status: 'success',
    data: {
      results: users.length,
      users,
    },
  });
});

export const getUserMiddleWare = catchAsync<{ params?: { id: string } }>(async (req, res, next) => {
  req.params.id = req.user.id;
});

export const getUser = factory.getOne(UserModel);

export const createUser = catchAsync(async (req, res) => {});

export const updateUser = catchAsync<UpdateUserApi>(async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  const { password, passwordConfirm } = req.body;

  if (password || passwordConfirm) {
    return next(
      new AppError('This route is not for password updates. Please use updatePassword Route', 400)
    );
  }

  const filteredBody: Record<string, any> = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
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

export const deleteUser = catchAsync<DeleteUserApi>(async (req, res) => {
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

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'src/public/img/users');
    },
    filename: (req: FR_Req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload onlt iamges.', 400) as null, false);
    }
  },
});

export const uploadPhoto = upload.single('photo');
