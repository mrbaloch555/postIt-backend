const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const config = require("../config/config");

const createUser = catchAsync(async (req, res) => {
  let body = req.body;
  const user = await userService.createUser(body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["firstName", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  for (let i = 0; i < result.results.length; i++) {
    result.results[
      i
    ].photoPath = `${config.rootPath}${result.results[i].photoPath}`;
  }
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  user.photoPath = `${config.rootPath}${user.photoPath}`;
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  let updateUserBody = req.body;
  if (req.file) updateUserBody.photoPath = req.file.filename;
  if (updateUserBody.socialMedia) {
    updateUserBody.socialMedia = JSON.parse(updateUserBody.socialMedia);
  }
  const user = await userService.updateUserById(
    req.params.userId,
    updateUserBody
  );
  user.photoPath = `${user.photoPath}`;
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const response = await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).send(response);
});

const addDeviceTokenInReviewer = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.body.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (req.body.addToken == true) {
    user.deviceToken.push(req.body.deviceToken);
    user.deviceToken = [...new Set([...user.deviceToken])];
  }
  if (req.body.addToken == false) {
    const index = user.deviceToken.indexOf(req.body.deviceToken);
    if (index > -1) {
      user.deviceToken.splice(index, 1);
    }
  }
  const updatedUser = await userService.updateUserById(req.body.userId, user);
  return res.send(updatedUser);
});
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addDeviceTokenInReviewer,
};
