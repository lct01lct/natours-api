import { Schema, Model } from 'mongoose';
import validator from 'validator';

export interface User {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

export const User = new Model('User', userSchema);
