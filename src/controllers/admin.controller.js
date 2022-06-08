const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { adminService, tokenService } = require("../services");

const createAdmin = catchAsync(async (req, res) => {
  let body = req.body;
  const user = await adminService.createAdmin(body);
  res.status(httpStatus.CREATED).send(user);
});

const getAdmins = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["firstName", "lastName", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await adminService.queryAdmins(filter, options);
  res.send(result);
});

const getAdmin = catchAsync(async (req, res) => {
  const user = await adminService.getAdminById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  res.send(user);
});

const updateAdmin = catchAsync(async (req, res) => {
  let updateUserBody = req.body;
  const user = await adminService.updateAdminById(
    req.params.id,
    updateUserBody
  );
  res.send(user);
});

const deleteAdmin = catchAsync(async (req, res) => {
  const response = await adminService.deleteAdminById(req.params.id);
  res.status(httpStatus.OK).send(response);
});

/**
 * Login Module
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await adminService.login(email, password);
  let tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

/**
 * Logout Module
 */
const logout = catchAsync(async (req, res) => {
  await adminService.logout(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  login,
  logout,
};
