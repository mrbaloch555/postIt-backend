const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const roleService = require("../services/role.service");
const logger = require("../config/logger");

const verifyCallback =
  (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    req.user = user;
    if (requiredRights.length) {
      logger.info(`User Role: ${user.role}`);
      const role = await roleService.getRoleByName(user.role);
      if (!role) {
        logger.error(`Role info not found for key: ${user.role}`);
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
      const userRights = role.rolePrivileges;
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
