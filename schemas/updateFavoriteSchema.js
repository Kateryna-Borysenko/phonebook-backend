import Joi from 'joi';

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})