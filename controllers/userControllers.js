import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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

  await User.create({ ...req.body, password: hashPassword });

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
