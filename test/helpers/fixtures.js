const fs = require("node:fs");
const path = require("node:path");

function loadFixture(name) {
  const fixturePath = path.join(__dirname, "..", "fixtures", name);
  return JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
}

module.exports = {
  loadFixture,
};
