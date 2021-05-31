const Contact = require("./contact");

const listContacts = async () => {
  return await Contact.find();
};

const getContactById = async (id) => {
  const result = await Contact.findOne({ _id: id });

  return result;
};

const removeContact = async (contactId) => {
  return await Contact.findByIdAndRemove({ _id: contactId });
};

const addContact = async (body) => {
  const newContact = await Contact.create(body);

  return newContact;
};

const updateContact = async (contactId, body) => {
  const result = await Contact.findOneAndUpdate({ _id: contactId }, body, {
    new: true,
  });

  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
