import express from 'express';
import {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  updateFavorite,
  deleteContact,
} from '../controllers/contactControllers.js';
import validateRequestBody from '../middleware/validateRequestBody.js';
import checkObjectId from '../middleware/checkObjectId.js';
import controllerWrapper from '../helpers/controllerWrapper.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import { updateFavoriteSchema } from '../schemas/updateFavoriteSchema.js';

const contactRouter = express.Router();

contactRouter.get('/', controllerWrapper(getAllContacts));

contactRouter.get('/:id', checkObjectId, controllerWrapper(getOneContact));

contactRouter.post('/', validateRequestBody(createContactSchema), controllerWrapper(createContact));

contactRouter.put('/:id', checkObjectId, validateRequestBody(updateContactSchema), controllerWrapper(updateContact));

contactRouter.patch("/:id/favorite", checkObjectId, validateRequestBody(updateFavoriteSchema), controllerWrapper(updateFavorite));

contactRouter.delete('/:id', checkObjectId, controllerWrapper(deleteContact));

export default contactRouter;
