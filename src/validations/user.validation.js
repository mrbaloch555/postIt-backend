const Joi = require("joi").extend(require("@joi/date"));
const { objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({}),
};

const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string().allow().optional(),
      lastName: Joi.string().allow().optional(),
      email: Joi.string().email().allow().optional(),
      password: Joi.string().allow().optional(),
      userName: Joi.string().allow().optional(),
      role: Joi.string().allow().optional(),
      DateofBirth: Joi.date()
        .format(["YYYY/MM/DD", "DD/MM/YYYY"])
        .allow()
        .optional(),
      addressL1: Joi.string().max(250).allow().optional(),
      addressL2: Joi.string().max(250).allow().optional(),
      city: Joi.string().allow().optional(),
      state: Joi.string().allow().optional(),
      postalCode: Joi.number().allow().optional(),
      country: Joi.string().allow().optional(),
      phone: Joi.number().allow().optional(),
      socialMedia: Joi.allow().optional(),
      photoPath: Joi.string().allow().optional(),
      active: Joi.boolean().allow().optional(),
      suspended: Joi.boolean().allow().optional(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
