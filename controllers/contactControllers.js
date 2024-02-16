import {
  contactList,
  getContactById,
  removeContact,
  addContact,
  modifyContact,
} from '../services/contactServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res) => {
  const contacts = await contactList();
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (!contact) {
    throw HttpError(404);
  }
  res.status(200).json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await removeContact(id);
  if (!contact) {
    throw HttpError(404);
  }
  res.status(200).json(contact);
};

export const createContact = async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await modifyContact(id, req.body);
  if (!updatedContact) {
    throw HttpError(404);
  }
  res.status(200).json(updatedContact);
};
