import { User } from '@/models';
import { AppError } from '@/utils';
import type { Request, Response, NextFunction } from 'express';

export interface FROptions {
  params?: any;
  body?: any;
  query?: any;
  res?: any;
}

interface ReqExtend {
  user?: User;
}

export type FROptionsDefault = Required<Record<keyof FROptions, never>>;
export type FR_Req<T extends FROptions = FROptionsDefault> = Request<
  T['params'],
  never,
  T['body'],
  T['query']
> &
  ReqExtend;
export type FR_Res<T extends FROptions = FROptionsDefault> = Response<T['res']>;

export type FR<T extends FROptions = FROptionsDefault> = (
  req: FR_Req<T>,
  res: FR_Res<T>,
  next?: NextFunction
) => Promise<void | AppError>;

export type Res<Data = never, Message = string> =
  | {
      status: 'success';
      data: Data;
    }
  | {
      status: 'fail';
      message: Message;
    };

export const LIMIT_FIELDS = ['page', 'sort', 'limit', 'fields'] as const;
export type LimitFields = Partial<Record<(typeof LIMIT_FIELDS)[number], string>>;
