import { Schema, model } from 'mongoose';

export interface Tour {
  name: string;
  rating?: number;
  price: number;
}

const tourSchema = new Schema<Tour>({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    require: [true, 'A tour must have a price'],
  },
});

export const TourModel = model<Tour>('Tour', tourSchema);
