const mongoose = require("mongoose");
const { paginate, toJSON } = require("./plugins");

const systemConfigSchema = mongoose.Schema(
  {
    activeSessions: {
      type: Number,
      default: 0,
    },
    actusToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
systemConfigSchema.plugin(toJSON);
systemConfigSchema.plugin(paginate);

/**
 * @typedef SystemConfig
 */
const SystemConfig = mongoose.model("SystemConfig", systemConfigSchema);

module.exports = SystemConfig;
