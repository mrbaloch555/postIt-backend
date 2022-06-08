const httpStatus = require("http-status");
const { SystemConfig } = require("../models");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");

/**
 * Create a SystemConfig
 * @returns {Promise<SystemConfig>}
 */
const createSystemConfig = async () => {
  const body = { activeSessions: 0, actusToken: "" };
  const systemConfig = await SystemConfig.create(body);
  return systemConfig;
};

/**
 * Get sessionCount
 * @returns {Promise<SystemConfig>}
 */
const getActiveSessionCount = async () => {
  const systemConfig = await SystemConfig.findOne();
  if (!systemConfig) {
    const sysConfig = await createSystemConfig();
    return sysConfig.activeSessions;
  }
  return systemConfig.activeSessions;
};

/**
 * Update sessionCount
 * @returns {Promise<SystemConfig>}
 */
const updateActiveSessionCount = async (factor) => {
  const systemConfig = await SystemConfig.findOne();
  if (!systemConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, "SystemConfig not found");
  }
  const newValue =
    systemConfig.activeSessions + factor < 0
      ? 0
      : systemConfig.activeSessions + factor;
  const updateBody = { activeSessions: newValue };
  Object.assign(systemConfig, updateBody);
  await systemConfig.save();
  return systemConfig;
};

/**
 * Get Actus Token
 * @returns {Promise<SystemConfig>}
 */
const getActusToken = async () => {
  const systemConfig = await SystemConfig.findOne();
  if (!systemConfig) {
    const sysConfig = await createSystemConfig();
    logger.info(`New Actus Token: ${sysConfig.actusToken}`);
    return sysConfig.actusToken;
  }
  return systemConfig.actusToken;
};

/**
 * Update Actus Token
 * @returns {Promise<SystemConfig>}
 */
const updateActusToken = async (token) => {
  const systemConfig = await SystemConfig.findOne();
  if (!systemConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, "SystemConfig not found");
  }

  const updateBody = { actusToken: token };
  Object.assign(systemConfig, updateBody);
  await systemConfig.save();
  return systemConfig;
};

module.exports = {
  createSystemConfig,
  getActiveSessionCount,
  updateActiveSessionCount,
  getActusToken,
  updateActusToken,
};
