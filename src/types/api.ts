import type { Request, Response, NextFunction } from 'express';

interface FROptions {
  params?: any;
  body?: any;
  query?: any;
  res?: any;
}

type FROptionsDefault = Required<Record<keyof FROptions, never>>;

export type FR<T extends FROptions = FROptionsDefault> = (
  req: Request<T['params'], never, T['body'], T['query']>,
  res: Response<T['res']>,
  next?: NextFunction
) => void;

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
