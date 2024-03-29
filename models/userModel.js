import mongoose from 'mongoose';
import { handleMongooseError } from '../helpers/handleMongooseError.js';
import { setUpdateSettings } from '../helpers/setUpdateSettings.js';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for user'],
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: {
      type: String,
      required: [true, 'Avatar is required'],
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: [true, 'VerificationCode is required'],
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', handleMongooseError);

userSchema.pre('findOneAndUpdate', setUpdateSettings);

userSchema.post('findOneAndUpdate', handleMongooseError);

const User = mongoose.model('User', userSchema);

export default User;
