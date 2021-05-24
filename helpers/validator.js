const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().alphanum().required(),
  phone: Joi.string(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

module.exports = {
  schema,
};
