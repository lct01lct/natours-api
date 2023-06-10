import { ObjectId, Query, Schema, model } from 'mongoose';
import { Tour, TourModel } from './tourModel';
import { User } from './userModel';

export interface Review {
  review: string;
  rating: number;
  createAt: Date;
  tour: Tour | ObjectId;
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

reviewSchema.statics.calcAverageRatings = async function (tourID) {
  const stats: { _id: ObjectId; avgRating: number; nRating: number }[] = await this.aggregate([
    {
      $match: { tour: tourID },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, // count of reviews ratings
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await TourModel.findByIdAndUpdate(tourID, {
      ratingsAverage: stats[0]?.avgRating,
      ratingQuantity: stats[0]?.nRating,
    });
  } else {
    await TourModel.findByIdAndUpdate(tourID, {
      ratingsAverage: 0,
      ratingQuantity: 4.5,
    });
  }
};

// Allow only one user to generator one review in one tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.post('save', async function () {
  await ReviewModel.calcAverageRatings(this.tour as ObjectId);
});

// Maybe use findOneAndUpdate / findOneAndDelete cause recalcuate
type ThisType = Query<any, any, {}, any, 'find'> & { __tourID__?: ObjectId };
reviewSchema.pre(/^findOneAnd/ as unknown as 'find', async function (this: ThisType, next) {
  const query = await this.model.findOne();
  this.__tourID__ = query.tour as ObjectId | undefined;

  next();
});

reviewSchema.post(/^findOneAnd/ as unknown as 'find', async function (this: ThisType) {
  if (this.__tourID__) {
    await ReviewModel.calcAverageRatings(this.__tourID__);
  }
});

const _ReviewModel = model('Review', reviewSchema);

export const ReviewModel = _ReviewModel as typeof _ReviewModel & {
  calcAverageRatings: (tourId: ObjectId) => void;
  r: Review[];
};
