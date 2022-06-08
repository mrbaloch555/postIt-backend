const httpStatus = require("http-status");
const { Role } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a role
 * @param {Object} userBody
 * @returns {Promise<Role>}
 */
const createRole = async (userBody) => {
  const role = await Role.create(userBody);
  return role;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @returns {Promise<QueryResult>}
 */
const queryRoles = async (filter, options) => {
  const roles = await Role.paginate(filter, options);
  return roles;
};

/**
 * Get role by name
 * @param {Object Id} id
 * @returns {Promise<Role>}
 */
const getRoleById = async (id) => {
  return Role.findById(id);
};

const getRoleByName = async (name) => {
  return Role.findOne({ roleName: name });
};

/**
 * Update role by name
 * @param {Object Id} id
 * @param {Object} updateBody
 * @returns {Promise<Role>}
 */
const updateRoleById = async (name, updateBody) => {
  const role = await getRoleById(name);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete role by name
 * @param {Object Id} id
 * @returns {Promise<Role>}
 */
const deleteRoleById = async (name) => {
  const role = await getRoleById(name);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  await role.remove();
  return role;
};

module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  getRoleByName,
  updateRoleById,
  deleteRoleById,
};
