const express = require("express");
const router = express.Router();
const api = require("../../model/index");
const { schema } = require("../../helpers/validator");

router.get("/", async (req, res, next) => {
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
});

router.get("/:contactId", async (req, res, next) => {
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
});

router.post("/", async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: error.details[0].message,
      });
    } else {
      const data = await api.addContact(value);
      return res.status(200).json({
        status: "success",
        code: 201,
        data: data,
      });
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await api.removeContact(req.params.contactId);
    console.log(contact);

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
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const isBody = Object.keys(req.body).length;

    if (!isBody) {
      return res
        .status(400)
        .json({ status: "error", code: 400, data: "missing fields" });
    }

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
});

module.exports = router;
