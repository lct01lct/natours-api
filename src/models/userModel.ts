import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const correctPassword = async function (candidatePassword: string, userPassword: string) {
  return bcrypt.compare(userPassword, candidatePassword);
};

const changedPasswordAfter = function (this: User, JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changeTimesStamp = parseInt(String(this.passwordChangedAt.getTime()));

    return JWTTimestamp < changeTimesStamp;
  }

  return false;
};

export interface User {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  role: Role;
  correctPassword?: typeof correctPassword;
  changedPasswordAfter?: typeof changedPasswordAfter;
}

const roles = ['user', 'guide', 'lead-guide', 'admin'] as const;

export type Role = (typeof roles)[number];

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
  role: {
    type: String,
    enum: roles,
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on SAVE!!!
      validator: function (val: string) {
        return this.password === val;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = correctPassword;
userSchema.methods.changedPasswordAfter = changedPasswordAfter;

export const UserModel = model('User', userSchema);
