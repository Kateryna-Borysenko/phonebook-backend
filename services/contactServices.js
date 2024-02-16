import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contactsPath = path.join(__dirname, '../db/contacts.json');

const contactList = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async contactId => {
  const contacts = await contactList();
  const result = contacts.find(item => item.id === contactId);
  return result || null;
};

const removeContact = async contactId => {
  const contacts = await contactList();
  const index = contacts.findIndex(item => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await contactList();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const modifyContact = async (contactId, updateData) => {
  const contacts = await contactList();
  const index = contacts.findIndex(item => item.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...updateData };
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



