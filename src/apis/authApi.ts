import { User } from '@/models';
import { Res } from '@/types';

type BaseRes = {
  user: User;
};

export interface SignupApi {
  body: User;
  res: Res<BaseRes & { token: string }>;
}
