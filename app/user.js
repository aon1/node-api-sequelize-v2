const Joi = require('joi')

module.exports = {
  index: {},
  create: {
    body: {
      name: Joi.string()
        .trim()
        .required(),
      email: Joi.string()
        .trim()
        .email({ minDomainAtoms: 2 })
        .required(),
      password: Joi.string()
        .trim()
        .required()
    }
  },
  update: {
    path: {
      userId: Joi.number()
        .integer()
        .required()
    },
    body: {
      name: Joi.string().trim(),
      email: Joi.string()
        .trim()
        .email({ minDomainAtoms: 2 }),
      password: Joi.string().trim()
    }
  },
  delete: {
    params: {
      userId: Joi.string()
        .trim()
        .required()
    }
  }
}
