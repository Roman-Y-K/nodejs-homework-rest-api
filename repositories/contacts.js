const Contact = require("../model/contact");

const listContacts = async (userId, query) => {
  const { filter, favorite = null, limit = 10, page = 1 } = query;

  const searchOptions = { owner: userId };
  if (favorite !== null) {
    searchOptions.favorite = favorite;
  }
  const result = await Contact.paginate(searchOptions, {
    limit,
    page,
    populate: {
      path: "owner",
      select: "name, email",
    },
  });

  return result;
};

const getContactById = async (userId, id) => {
  const result = await Contact.findOne({ _id: id, owner: userId }).populate({
    path: "owner",
    select: "name, email",
  });

  return result;
};

const removeContact = async (userId, contactId) => {
  return await Contact.findByIdAndRemove({ _id: contactId, owner: userId });
};

const addContact = async (userId, body) => {
  const newContact = await Contact.create({ owner: userId, ...body });

  return newContact;
};

const updateContact = async (contactId, body, userId) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    body,
    {
      new: true,
    }
  );

  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
