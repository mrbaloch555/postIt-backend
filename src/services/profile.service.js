const httpStatus = require("http-status");
const { User, Profile } = require("../models");
const ApiError = require("../utils/ApiError");
/**
 * Create a user
 * @param {Object} profileBody
 * @returns {Promise<Profile>}
 */
const createProfile = async (profileBody) => {
  const user = await User.findById(profileBody.user);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No user found.");
  }
  const profile = await Profile.create(profileBody);
  return profile;
};

/**
 * Query for users
 * @returns {Promise<QueryResult>}
 */
const queryProfiles = async (filter, options) => {
  const profiles = await Profile.paginate(filter, options);
  return profiles;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Profile>}
 */
const getProfileByUserId = async (id) => {
  return await Profile.findOne({ user: id })
    .populate("user")
    .populate("followers")
    .populate("following");
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateProfileById = async (userId, updateBody) => {
  const profile = await getProfileByUserId(userId);
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
  }
  Object.assign(profile, updateBody);
  await profile.save();
  await Profile.populate(profile, { path: "user" });
  return profile;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteProfileById = async (userId) => {
  const profile = await getUserById(userId);
  if (!profile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No account found for this user!"
    );
  }
  await profile.remove();
  return (response = { msg: "profile deleted" });
};

const getProfileById = async (profileId) => {
  return Profile.findById(profileId)
    .populate("user")
    .populate("followers")
    .populate("following");
};
/**
 *
 * @param {*} followerId
 * @param {*} followingId
 * @returns {Promise<Profile>}
 */
const followUser = async (followerId, followingId) => {
  const followerProfile = await getProfileByUserId(followerId);
  const followingProfile = await getProfileByUserId(followingId);
  if (!followerProfile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No profile found for follower."
    );
  }

  if (!followingProfile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No profile found for following."
    );
  }
  if (followerProfile.id.toString() === followingProfile.id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You cannot follow yourself!");
  }
  followerProfile.following.forEach((f) => {
    if (f.id === followingProfile.user.id) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You are already following the user"
      );
    }
  });
  followerProfile.following.push(followingProfile.user);
  await followerProfile.save();
  followingProfile.followers.push(followerProfile.user);
  await followingProfile.save();
  return followerProfile;
};

/*
 * @param {*} followerId
 * @param {*} followingId
 * @returns {Promise<Profile>}
 */
const unfollowUser = async (followerId, followingId) => {
  const followerProfile = await getProfileByUserId(followerId);
  const followingProfile = await getProfileByUserId(followingId);
  if (!followerProfile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No profile found for follower."
    );
  }

  if (!followingProfile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No profile found for following."
    );
  }
  const indexOfFollower = followerProfile.following.findIndex(
    (f) => f.id === followingProfile.user.id
  );
  const indexOfFollowing = followingProfile.followers.findIndex(
    (f) => f.id === followerProfile.user.id
  );
  if (indexOfFollower < 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You are not following the user."
    );
  }

  followerProfile.following.splice(indexOfFollower, 1);
  await followerProfile.save();
  followingProfile.followers.splice(indexOfFollowing, 1);
  await followingProfile.save();
  return followerProfile;
};
module.exports = {
  createProfile,
  queryProfiles,
  getProfileByUserId,
  updateProfileById,
  deleteProfileById,
  followUser,
  unfollowUser,
};
