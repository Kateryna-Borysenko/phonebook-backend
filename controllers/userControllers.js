import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import Jimp from 'jimp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';
import HttpError from '../helpers/HttpError.js';
import sendEmail from '../helpers/sendEmail.js';
import generateToken from '../helpers/generateToken.js';

dotenv.config();

const SERVER_BASE_URL = process.env.SERVER_BASE_URL;
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

export const registerUser = async (req, res) => {
  const verificationCode = nanoid();
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: '250' });

  await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${SERVER_BASE_URL}/api/users/verify/${verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email,
    name,
  });
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;

  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw HttpError(401, 'Email not found');
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: '',
  });

  res.set('Location', `${CLIENT_BASE_URL}/email-confirmed`);
  res.status(302).end(); 
};

export const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email not found');
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${SERVER_BASE_URL}/api/users/verify/${user.verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: 'Verification email sent',
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
  }

  const passwordCompare =
    user && (await bcrypt.compare(password, user.password));

  if (!user || !passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }

  generateToken(res, user._id);

  res.status(202).json({
    user: {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    },
  });
};

export const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

export const logoutUser = async (req, res) => {
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
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    throw new HttpError(404);
  }
  res.status(200).json({ subscription });
};

export const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');

  const { path: tmpUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tmpUpload, resultUpload);

  const image = await Jimp.read(resultUpload);
  await image.cover(250, 250).writeAsync(resultUpload);

  const avatarURL = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    message: 'Avatar updated successfully',
    avatarURL,
  });
};
