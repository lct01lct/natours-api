import { User } from '@/models';
import { Res } from '@/types';

export interface GetAllUsersApi {
  res: Res<{
    results: number;
    users: Pick<User, Exclude<keyof User, 'password'>>[];
  }>;
}
