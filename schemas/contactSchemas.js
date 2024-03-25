import Joi from 'joi';
import { EMAIL_REGEX, PHONE_REGEX } from '../helpers/regexPatterns.js';

const baseContactSchemaFields = {
  name: Joi.string().min(3).max(30).required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name must be less than or equal to {#limit} characters long',
      'any.required': 'Name is a required field'
    }),
  phone: Joi.string().pattern(PHONE_REGEX).required()
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'string.empty': 'Phone number cannot be empty',
      'any.required': 'Phone number is a required field'
    }),
  favorite: Joi.boolean().default(false).optional()
    .messages({
      'boolean.base': 'Favorite must be a boolean value'
    }),
};

export const createContactSchema = Joi.object({
  ...baseContactSchemaFields,
});

export const updateContactSchema = Joi.object({
  ...baseContactSchemaFields,
});
