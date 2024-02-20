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
import { protect } from '../middleware/authMiddleware.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import { updateFavoriteSchema } from '../schemas/updateFavoriteSchema.js';

const contactRouter = express.Router();

contactRouter.get('/', protect, controllerWrapper(getAllContacts));

contactRouter.get('/:id', protect, checkObjectId, controllerWrapper(getOneContact));

contactRouter.post('/', protect, validateRequestBody(createContactSchema), controllerWrapper(createContact));

contactRouter.put('/:id', protect, checkObjectId, validateRequestBody(updateContactSchema), controllerWrapper(updateContact));

contactRouter.patch("/:id/favorite", protect, checkObjectId, validateRequestBody(updateFavoriteSchema), controllerWrapper(updateFavorite));

contactRouter.delete('/:id', protect, checkObjectId, controllerWrapper(deleteContact));

export default contactRouter;
