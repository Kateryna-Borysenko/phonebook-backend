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

export const getOneContact = (req, res) => { };

export const deleteContact = (req, res) => { };

export const createContact = (req, res) => { };

export const updateContact = (req, res) => { };
