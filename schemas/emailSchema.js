import Joi from 'joi';
import { EMAIL_REGEX } from '../helpers/regexPatterns.js';

export const emailSchema = Joi.object({
  email: Joi.string()
    .pattern(EMAIL_REGEX)
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is a required field',
    }),
});