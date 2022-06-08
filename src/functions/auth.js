const crypto = require("crypto");
/**
 *
 * @returns Number
 */
const generateRandomMembershipId = async (length) => {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
};

const generateRandomPassword = async () => {
  length = 10;
  wishlist =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$";

  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join("");
};

const generateRandomUserName = async (email) => {
  return email.split("@")[0];
};

module.exports = {
  generateRandomMembershipId,
  generateRandomPassword,
  generateRandomUserName,
};
