import express from 'express';
import mongoose from 'mongoose';
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
  token: String
}, { versionKey: false, timestamps: true });

userSchema.post('save', handleMongooseError);

const User = mongoose.model('User', userSchema);

export default User;