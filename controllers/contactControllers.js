import Contact from '../models/contactModel.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find()
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    throw HttpError(404);
  }
  res.status(200).json(contact);
};

export const createContact = async (req, res) => {
  const existingContact = await Contact.findOne({ phone: req.body.phone });

  if (existingContact) {
    return res.status(409).json({ message: 'Contact with this phone number already exists.' });
  }

  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw HttpError(404);
  }

  const isAnyFieldChanged = Object.keys(updates).some((key) => contact[key] !== updates[key]);

  if (!isAnyFieldChanged) {
    return res.status(200).json({ message: "No changes detected. Contact was not updated." });
  }

  const updatedContact = await Contact.findByIdAndUpdate(id, updates, { new: true });

  res.status(200).json(updatedContact);
};


export const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
}

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    throw HttpError(404);
  }
  res.status(200).json({ message: 'Contact removed' });
};