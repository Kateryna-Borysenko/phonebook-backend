import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from '../controllers/contactControllers.js';
import validateRequestBody from '../middleware/validateRequestBody.js';
import controllerWrapper from '../helpers/controllerWrapper.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';

const contactRouter = express.Router();

contactRouter.get('/', controllerWrapper(getAllContacts));

contactRouter.get('/:id', controllerWrapper(getOneContact));

contactRouter.delete('/:id', controllerWrapper(deleteContact));

contactRouter.post('/', validateRequestBody(createContactSchema), controllerWrapper(createContact));

contactRouter.put('/:id', validateRequestBody(updateContactSchema), controllerWrapper(updateContact));

export default contactRouter;
