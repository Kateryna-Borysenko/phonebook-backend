import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw HttpError(401, 'Not authorized, no token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    next();
  } catch (err) {
    next(HttpError(401, err.message));
  }
};


