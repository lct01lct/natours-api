import { Schema, model } from 'mongoose';
import { Tour } from './tourModel';
import { User } from './userModel';

export interface Review {
  review: string;
  rating: number;
  createAt: Date;
  tour: Tour;
  user: User;
}

const reviewSchema = new Schema<Review>(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/ as unknown as 'find', function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

export const ReviewModel = model('Review', reviewSchema);
