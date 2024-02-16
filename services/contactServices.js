import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import HttpError from '../helpers/HttpError.js';
import { trimObjectValues } from '../helpers/trimObjectValues.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contactsPath = path.join(__dirname, '../db/contacts.json');

const contactList = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async id => {
  const contacts = await contactList();
  const result = contacts.find(item => item.id === id);
  return result || null;
};

const removeContact = async id => {
  const contacts = await contactList();
  const index = contacts.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await contactList();

  const phoneExists = contacts.some(contact => contact.phone === phone);
  if (phoneExists) {
    throw HttpError(409, 'Phone number already exists');
  }

  const trimmedContactData = trimObjectValues({ name, email, phone });

  const newContact = {
    id: nanoid(),
    ...trimmedContactData,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const modifyContact = async (id, updateData) => {
  const trimmedUpdateData = trimObjectValues(updateData);

  const contacts = await contactList();
  const index = contacts.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }

  const contactBeforeUpdate = await getContactById(id);

  const { name, email, phone } = trimmedUpdateData;
  if (
    contactBeforeUpdate.name === name &&
    contactBeforeUpdate.email === email &&
    contactBeforeUpdate.phone === phone
  ) {
    throw HttpError(400, 'No changes were made to the contact');
  }

  contacts[index] = { ...contacts[index], ...trimmedUpdateData };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

export {
  contactList,
  getContactById,
  removeContact,
  addContact,
  modifyContact,
};



