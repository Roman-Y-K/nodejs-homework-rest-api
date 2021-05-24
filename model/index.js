const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const readFile = async () => {
  const contacts = await fs.readFile(
    path.join(__dirname, "contacts.json"),
    "utf-8"
  );

  return JSON.parse(contacts);
};

const listContacts = async () => {
  return readFile();
};

const getContactById = async (contactId) => {
  const contacts = await readFile();

  const result = contacts.find((contact) => String(contact.id) === contactId);

  return result;
};

const removeContact = async (contactId) => {
  const contacts = await readFile();

  const indexContact = contacts.findIndex(
    (contact) => String(contact.id) === contactId
  );

  if (indexContact !== -1) {
    const deletedContact = contacts.splice(indexContact, 1);

    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(contacts)
    );
    return deletedContact;
  }
};

const addContact = async (body) => {
  const id = uuidv4();

  const newContact = {
    id,
    ...body,
  };

  const contacts = await readFile();
  contacts.push(newContact);

  await fs.writeFile(
    path.join(__dirname, "contacts.json"),
    JSON.stringify(contacts)
  );
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await readFile();

  const result = contacts.find((contact) => String(contact.id) === contactId);

  if (result) {
    Object.assign(result, body);
    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(contacts)
    );
  }
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
