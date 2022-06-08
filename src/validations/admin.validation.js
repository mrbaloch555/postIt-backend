const Joi = require("joi").extend(require("@joi/date"));
const { password, objectId } = require("./custom.validation");

const createAdmin = {
  body: Joi.object()
    .keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      DateofBirth: Joi.date().format(["YYYY/MM/DD", "DD/MM/YYYY"]).required(),
      email: Joi.string().email().required(),
      userName: Joi.string().required(),
      password: Joi.string().custom(password),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().required(),
      role: Joi.string().required(),
    })
    .min(1),
};

const getAdmin = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateAdmin = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      DateofBirth: Joi.date().format(["YYYY/MM/DD", "DD/MM/YYYY"]).required(),
      email: Joi.string().email().required(),
      userName: Joi.string().required(),
      password: Joi.string().custom(password),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().required(),
      active: Joi.boolean().allow().optional(),
      suspended: Joi.boolean().allow().optional(),
      role: Joi.string().allow().optional(),
    })
    .min(1),
};

const deleteAdmin = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
module.exports = {
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  login,
  logout,
};
