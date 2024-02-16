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

const contactRouter = express.Router();

contactRouter.get('/', controllerWrapper(getAllContacts));

contactRouter.get('/:id', getOneContact);

contactRouter.delete('/:id', deleteContact);

contactRouter.post('/', createContact);

contactRouter.put('/:id', updateContact);

export default contactRouter;
