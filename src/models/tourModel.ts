import { Schema, model } from 'mongoose';
import { User } from './userModel';
import { Review } from './reviewModel';
export interface Tour {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage?: number;
  ratingQuantity?: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  createdAt?: Date;
  startDates?: Date[];
  locations: {
    type: string;
    coordinates: [number, number];
    address: string;
    description: string;
    day: number;
  }[];
  guides: User[];

  durationWeeks: number;
  reviews?: Review[] | null;
}

const tourSchema = new Schema<Tour>(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minLength: [10, 'A tour name must have more or equal then 10 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      // required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val: number) {
          console.log(typeof val, typeof this.price);
          return Number(val) < Number(this.price);
        },
        // ({VALUE}) equal input value
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    locations: [
      {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// tourSchema.pre('save', function (next) {
//   // create a new properity need declare on model
//   // this.slug = slugify(this.name, { lower: true});
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   // console.log(this === doc); // true
//   next();
// });

// tourSchema.pre(/^find/, function (next) {
//   // @ts-ignore
//   this.find({ secretTour: { $ne: true } });
//   // @ts-ignore
//   this.start = Date.now();

//   next();
// });

// tourSchema.post(/^find/, function (docs, next) {
//   // @ts-ignore
//   console.log(Date.now() - this.start);
//   next();
// });

// tourSchema.pre('save', async function (next) {
//   this.guides = await Promise.all(this.guides.map(async el => UserModel.findById(el)));

//   next();
// });

tourSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true },
    },
  });

  next();
});

export const TourModel = model<Tour>('Tour', tourSchema);
