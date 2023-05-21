import { LIMIT_FIELDS, LimitFields } from '../types';
import { Query } from 'mongoose';

class APIFeatures<T extends Query<any, any>, K extends LimitFields> {
  constructor(public query: T, private queryString: K) {}

  filter() {
    const queryObj = { ...this.queryString };
    LIMIT_FIELDS.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr)) as T;

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(`-createdAt`);
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // exclude __v
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page || 1);
    const limit = Number(this.queryString.limit || 100);
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export { APIFeatures };
