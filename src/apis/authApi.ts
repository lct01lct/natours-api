import { User } from '@/models';
import { Res } from '@/types';

type BaseRes = {
  user: User;
};

export interface SignupApi {
  body: User;
  res: Res<BaseRes & { token: string }>;
}

export interface LoginApi {
  body: Partial<Pick<User, 'email' | 'password'>>;
  res: Res<{ token: string }>;
}

export interface ProtectApi {
  body: {
    token: string;
  };
}

export interface ForgotPasswordApi {
  body: {
    email: string;
  };
  res: Res<{
    message: string;
  }>;
}

export interface ResetPasswordApi {
  params: {
    token: string;
  };
  body: {
    password: string;
    passwordConfirm: string;
    token: string;
  };
  res: Res<{}>;
}
