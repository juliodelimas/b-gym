const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "b-gym-dev-secret";
const TOKEN_EXPIRATION_SECONDS = 3600;

module.exports = {
  PORT,
  JWT_SECRET,
  TOKEN_EXPIRATION_SECONDS,
};
