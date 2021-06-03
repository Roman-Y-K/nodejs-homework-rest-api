const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/controllers");

const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateStatusContact,
  validateMongoId,
} = require("../../helpers/validator");

router.get("/", ctrl.getAllContacts);

router.get("/:contactId", validateMongoId, ctrl.getContactById);

router.post("/", validationCreateContact, ctrl.createContact);

router.delete("/:contactId", validateMongoId, ctrl.deleteContact);

router.put(
  "/:contactId",
  validateMongoId,
  validationUpdateContact,
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  validationUpdateStatusContact,
  ctrl.updateContact
);

module.exports = router;
