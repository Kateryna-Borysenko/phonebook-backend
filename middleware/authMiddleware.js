import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(HttpError(401, "Authorization headers not found"));
  }

  const [bearer, token] = authorization.split(" ");

  if (!bearer) {
    return next(HttpError(401, "Bearer not found"));
  }

  try {

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOne ({ _id: id });

    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    
    if (!user.token) {
      return next(HttpError(401, "No token"));
    }

    req.user = user;

    next();
  } catch (err) {
    next(HttpError(401, err.message));
  }
};


