import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (err) {
      next(HttpError(401, err.message))
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
}


