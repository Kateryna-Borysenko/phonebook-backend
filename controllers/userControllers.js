import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';
import HttpError from '../helpers/HttpError.js';
import generateToken from '../helpers/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: '250' });

  await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    email,
    name,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      user: {
        id: user._id,
        password,
        email,
      },
    });
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
};

export const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  })
}

export const logoutUser = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

export const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new HttpError(404);
  }

  res.status(200).json({ message: `You have updated your subscription to ${updatedUser.subscription}` });
};

export const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const avatarsDir = path.join(__dirname, "../", "public", "avatars");

  const { path: tmpUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tmpUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    message: 'Avatar updated successfully',
    avatarURL
  });
}
