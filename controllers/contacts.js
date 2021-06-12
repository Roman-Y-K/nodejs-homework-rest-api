const api = require("../repositories/contacts");

const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { docs: contacts, ...rest } = await api.listContacts(
      userId,
      req.query
    );
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { contacts, ...rest },
    });
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await api.getContactById(userId, req.params.contactId);
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
    const userId = req.user;
    const data = await api.addContact(userId, req.body);
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
    const userId = req.user.id;
    const contact = await api.removeContact(userId, req.params.contactId);

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
    const userId = req.user.id;
    const contact = await api.updateContact(
      userId,
      req.params.contactId,
      req.body
    );

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
