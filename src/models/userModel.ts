import { Schema, model } from 'mongoose';
import validator from 'validator';
import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AppError } from '@/utils';

const correctPassword = async function (candidatePassword: string, userPassword: string) {
  return bcrypt.compare(userPassword, candidatePassword);
};

const changedPasswordAfter = function (this: User, JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changeTimesStamp = parseInt(String(this.passwordChangedAt.getTime() / 1000));

    return JWTTimestamp < changeTimesStamp;
  }

  return false;
};

const createPasswordResetToken = function (this: User) {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

export interface User {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  role: Role;
  passwordResetToken: string;
  passwordResetExpires: Date;
  active: boolean;
  correctPassword?: typeof correctPassword;
  changedPasswordAfter?: typeof changedPasswordAfter;
  createPasswordResetToken?: typeof createPasswordResetToken;
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
  photo: {
    type: String,
    default: 'default.jpg',
  },
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password'))
    return next(
      new AppError(
        'Current password is equal original password, Please Change password again!',
        400
      )
    );
  if (this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);

  next();
});

userSchema.pre('find', function (next) {
  this.find({ active: { $ne: false } });

  next();
});

userSchema.methods.correctPassword = correctPassword;
userSchema.methods.changedPasswordAfter = changedPasswordAfter;
userSchema.methods.createPasswordResetToken = createPasswordResetToken;

export const UserModel = model('User', userSchema);
