const mongoose = require("mongoose");
const { paginate, toJSON } = require("./plugins");

const roleSchema = mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      trim: true,
    },
    rolePrivileges: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);

/**
 * @typedef Role
 */
const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
