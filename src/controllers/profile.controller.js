const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { profileService } = require("../services");
const config = require("../config/config");

const createProfile = catchAsync(async (req, res) => {
  let body = req.body;
  const profile = await profileService.createProfile(body);
  res.status(httpStatus.CREATED).send(profile);
});

const getProfiles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["firstName", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.populate = "user,followers,following";

  const result = await profileService.queryProfiles(filter, options);
  res.send(result);
});

const getProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getProfileByUserId(req.params.id);
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
  }
  res.send(profile);
});

const updateProfile = catchAsync(async (req, res) => {
  let updateUserBody = req.body;
  const profile = await profileService.updateProfileById(
    req.params.id,
    updateUserBody
  );
  res.send(profile);
});

const followUser = catchAsync(async (req, res) => {
  const { following } = req.body;
  const profile = await profileService.followUser(req.user.id, following);
  res.send(profile);
});

const unfollowUser = catchAsync(async (req, res) => {
  const { following } = req.body;
  const profile = await profileService.unfollowUser(req.user.id, following);
  res.send(profile);
});
module.exports = {
  createProfile,
  getProfiles,
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
};
