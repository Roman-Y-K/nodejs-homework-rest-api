const Joi = require("joi");
const mongoose = require("mongoose");

const createContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  phone: Joi.string().min(0).max(35).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  favorite: Joi.boolean().optional(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  phone: Joi.string().min(0).max(35).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  favorite: Joi.boolean().optional(),
}).or("name", "phone", "email", "favorite");

const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ""),
    });
  }
};

module.exports = {
  validationCreateContact: (req, res, next) => {
    return validate(createContactSchema, req.body, next);
  },
  validationUpdateContact: (req, res, next) => {
    return validate(updateContactSchema, req.body, next);
  },
  validationUpdateStatusContact: (req, res, next) => {
    return validate(updateStatusContactSchema, req.body, next);
  },
  validateMongoId: (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.contactId)) {
      return next({
        status: 400,
        message: "Invalid ObjectId",
      });
    }
    next();
  },
};
