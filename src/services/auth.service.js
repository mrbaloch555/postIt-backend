const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const config = require("../config/config");
const { User } = require("../models");
const _ = require("lodash");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect membership id or user name or password"
    );
  } else if (user.suspended) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Your account has been suspended! Please contact your adminstrator"
    );
  }
  const updateBody = user;
  updateBody.active = true;
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (data) => {
  let refreshToken = data.refreshToken;
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  const userId = refreshTokenDoc.user;
  await User.updateOne({ _id: userId }, { $set: { active: false } });
  await refreshTokenDoc.remove();
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return await User.findById(id);
};
/**
 *
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const approveUser = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user found!");
  }
  if (user.status === "approved") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User status is already approved!"
    );
  }
  const updatedBody = {
    status: "approved",
  };
  Object.assign(user, updatedBody);
  await user.save();
  return user;
};
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    // if(refreshTokenDoc.length)
    if (!_.isEmpty(refreshTokenDoc)) {
      const user = await userService.getUserById(refreshTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      await refreshTokenDoc.remove();
      return tokenService.generateAuthTokens(user);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "No token found");
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

const changePassword = async (body) => {
  const { email, user_id, oldPassword, newPassword } = body;
  const user = await User.findOne({ email, user_id });
  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "No user found, please try with correct email and membership id!"
    );
  }
  const check = await user.isPasswordMatch(oldPassword);
  if (!check) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect old password");
  } else {
    user.password = newPassword;
    await user.save();
    return user;
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Reset password
 * @param {string} email
 * @param {string} newPassword
 * @param {string} oldPassword
 * @returns {Promise}
 */
const resetPasswordviaEmail = async (email, newPassword) => {
  try {
    const user = await userService.getUserByEmail(email);
    await userService.updateUserById(user.id, { password: newPassword });
    const result = "Password Updated";
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

module.exports = {
  login,
  logout,
  approveUser,
  refreshAuth,
  resetPassword,
  resetPasswordviaEmail,
  changePassword,
};
