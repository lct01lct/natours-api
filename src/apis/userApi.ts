import { User } from '@/models';
import { Res } from '@/types';

export interface GetAllUsersApi {
  res: Res<{
    results: number;
    users: Pick<User, Exclude<keyof User, 'password'>>[];
  }>;
}

export interface UpdateUserApi {
  body: {
    password: string;
    passwordConfirm: string;
    name?: string;
    email?: string;
  };

  res: Res<{
    user: User;
  }>;
}

export interface DeleteUserApi {
  res: Res<{}>;
}
