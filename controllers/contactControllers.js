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
  res.json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

export const deleteContact = async (req, res) => { };

export const createContact = async (req, res) => { };

export const updateContact = async (req, res) => { };
