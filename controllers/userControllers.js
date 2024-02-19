import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import HttpError from '../helpers/HttpError.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email,
    name,
  })
}
