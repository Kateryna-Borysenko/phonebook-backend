import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import User from '../models/userModel.js';
import HttpError from '../helpers/HttpError.js';
import sendEmail from '../helpers/sendEmail.js';
import cloudinary from "../helpers/cloudinary.js";

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

  await User.create({ ...req.body, password: hashPassword, avatarURL, verificationCode });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html:
    `<html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                  background-color: #161616;
                  color: white;
              }
              .container {
                background-color: #161616;
                color: white;
                  padding: 50px 0;
                  text-align: center;
              }
              .title{
                  color:#d4fd02;
                  margin-bottom: 44px;
              }
              .image{
                  width: 250px;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 20px 0;
                  background-color: #8baa36;
                  color: white;
                  text-decoration: none;
                  font-weight: bold;
                  transition: background-color 0.3s;
              }
              .button:hover {
                  background-color: #8baa36ce;
              }
              .description{
                  color:grey;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2 class="title">Verify your email address</h2>
              <p>Thanks for signing up with us. <br/> Click on the button below to verify your email address.</p>
              <a class="button" href="${SERVER_BASE_URL}/api/users/verify/${verificationCode}">Click to verify email</a>
              <p class="description">If this email wasn't intended for you, feel free to delete it.</p>
          </div>
      </body>
    </html>`,
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

  const {_id: id} = user;

  const payload = {
    id,
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

  await User.findByIdAndUpdate(user._id, {token});

  res.status(202).json({
    token,
    user: {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      subscription: user.subscription
    },
  });
};

export const getCurrentUser = async (req, res) => {
  const user = req.user;
  
  res.json({
    user: {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      subscription: user.subscription
    },
});
};

export const logoutUser = async (req, res) => { 
  const { _id } = req.user;
  await User.findByIdAndUpdate( _id, { token: "" }, { new: true, runValidators: true }
);

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
  res.status(200).json({ subscription });
};


export const updateAvatar = async (req, res) => {
const { _id } = req.user;

  const {url: avatarURL} = await cloudinary.uploader.upload(req.file.path, {
    folder: "phonebook-avatars"
})

await fs.unlink(req.file.path);
await User.findByIdAndUpdate(_id, {avatarURL}, 
  { new: true });

  res.status(201).json({
    message: 'Avatar updated successfully',
    avatarURL,
    
  });
};
