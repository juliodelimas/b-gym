const http = require("node:http");

const { createApp } = require("../../src/app");

async function startApiServer() {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Nao foi possivel obter a porta do servidor de testes.");
  }

  return {
    server,
    port: address.port,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

async function stopApiServer(server) {
  if (!server || !server.listening) {
    return;
  }

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

module.exports = {
  startApiServer,
  stopApiServer,
};
