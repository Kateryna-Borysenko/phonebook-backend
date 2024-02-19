import Joi from 'joi';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../helpers/regexPatterns.js';

const baseUserSchemaFields = {
  email: Joi.string()
    .pattern(EMAIL_REGEX)
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is a required field',
    }),

  password: Joi.string()
    .min(6)
    .max(50)
    .pattern(PASSWORD_REGEX)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password must be less than or equal to 50 characters long',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      'any.required': 'Password is a required field',
    }),

};

export const registerSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Name must only contain alpha-numeric characters',
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must be less than or equal to 30 characters long',
      'any.required': 'Name is a required field',
    }),

  ...baseUserSchemaFields,
});

export const loginSchema = Joi.object({
  ...baseUserSchemaFields,
});