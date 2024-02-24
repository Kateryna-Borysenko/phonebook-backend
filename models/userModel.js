import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { handleMongooseError } from '../helpers/handleMongooseError.js';

const userSchema = mongoose.Schema({
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
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  avatarURL: {
    type: String,
    required: [true, 'Avatar is required']
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    required: [true, 'VerificationCode is required'],
  }
}, { versionKey: false, timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.post('save', handleMongooseError);

const User = mongoose.model('User', userSchema);

export default User;