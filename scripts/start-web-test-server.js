const { PORT } = require("../src/config");
const { createApp } = require("../src/app");

const app = createApp();
const server = app.listen(PORT, () => {
  console.log(`B-Gym API executando em http://localhost:${PORT}`);
});

// Mantem o processo vivo de forma explicita durante a execucao do Cypress.
const keepAlive = setInterval(() => {}, 60_000);

function shutdown() {
  clearInterval(keepAlive);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
