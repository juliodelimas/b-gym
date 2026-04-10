const crypto = require("node:crypto");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function createId() {
  return crypto.randomUUID();
}

module.exports = {
  hashPassword,
  createId,
};
