const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateStatusContact,
  validateMongoId,
} = require("../../../helpers/validator");

router.get("/", guard, ctrl.getAllContacts);

router.get("/:contactId", guard, validateMongoId, ctrl.getContactById);

router.post("/", guard, validationCreateContact, ctrl.createContact);

router.delete("/:contactId", guard, validateMongoId, ctrl.deleteContact);

router.put(
  "/:contactId",
  guard,
  validateMongoId,
  validationUpdateContact,
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  guard,
  validationUpdateStatusContact,
  ctrl.updateContact
);

module.exports = router;
