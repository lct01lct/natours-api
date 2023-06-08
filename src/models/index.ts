export * from './tourModel';
export * from './userModel';
export * from './reviewModel';

export const complex = (field: ModelFields) => `${field}s`;
export enum ModelFields {
  TOUR = 'tour',
  USER = 'user',
  REVIRW = 'review',
}
