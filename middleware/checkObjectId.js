import { isValidObjectId } from 'mongoose';

import HttpError from '../helpers/HttpError.js';

const checkObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(HttpError(400, `Invalid ObjectId of: ${id}`))
  }
  next();
}

export default checkObjectId;