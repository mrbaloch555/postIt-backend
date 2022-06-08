const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const profileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bio: {
      type: String,
      trime: true,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

profileSchema.plugin(toJSON);
profileSchema.plugin(paginate);
/**
 * @typedef Profile
 */
const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
