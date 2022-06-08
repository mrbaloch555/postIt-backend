const Joi = require("joi").extend(require("@joi/date"));
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required().description("First name is required"),
    lastName: Joi.string().required().description("Last name is required"),
    email: Joi.string().email().description("Email is required"),
    password: Joi.string().required(),
    DateofBirth: Joi.date().format(["YYYY/MM/DD", "DD/MM/YYYY"]).required(),
    addressL1: Joi.string()
      .max(250)
      .required()
      .description("Address line 1 can't be greater then 250 characters"),
    addressL2: Joi.string()
      .max(250)
      .required()
      .description("Address line 2 can't be greater then 250 characters"),
    city: Joi.string().required().description("City is required"),
    state: Joi.string().required().description("State is required"),
    postalCode: Joi.string().required().description("Postal code is required"),
    country: Joi.string().required().description("Country is required"),
    phone: Joi.string()
      .required()
      .required()
      .description("Phone number is required"),
    socialMedia: Joi.allow().optional(),
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

const changePassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    user_id: Joi.number().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  changePassword,
};
