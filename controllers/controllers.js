const api = require("../model/contacts");

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await api.listContacts();
    return res.status(200).json({
      status: "success",
      code: 200,
      data: contacts,
    });
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await api.getContactById(req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: "success",
        code: 200,
        data: contact,
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const createContact = async (req, res, next) => {
  try {
    const data = await api.addContact(req.body);
    return res.status(201).json({
      status: "success",
      code: 201,
      data: data,
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      e.status = 400;
    }
    next(e);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await api.removeContact(req.params.contactId);

    if (contact) {
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "contact deleted",
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await api.updateContact(req.params.contactId, req.body);

    if (contact) {
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "contact updated",
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
};
