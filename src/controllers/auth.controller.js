const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
  smsService,
} = require("../services");
const { User } = require("../models");
const { authFunctions } = require("../functions");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");

/**
 * Registration Module
 */
const register = catchAsync(async (req, res) => {
  let createUserBody = req.body;
  if (req.file) createUserBody.photoPath = req.file.filename;
  if (createUserBody.socialMedia !== undefined) {
    createUserBody.socialMedia = JSON.parse(createUserBody.socialMedia);
  }
  createUserBody.userName = await authFunctions.generateRandomUserName(
    createUserBody.email
  );
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

/**
 * Login Module
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  let tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

/**
 * Logout Module
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Change Password Module
 */
const changePassword = catchAsync(async (req, res) => {
  const user = await authService.changePassword(req.body);
  const emailMessage = {
    to: user.email,
    from: {
      email: config.email.fromEmail,
    },
    subject: "Password Change",
    html: `
    <p>Your password changed successfully.</p>
    `,
  };
  emailService.sendMail(emailMessage);
  res.json(user);
});

module.exports = {
  register,
  login,
  logout,
  changePassword,
};
