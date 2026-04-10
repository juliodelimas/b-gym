const { PORT } = require("./config");
const { createApp } = require("./app");

const app = createApp();

app.listen(PORT, () => {
  console.log(`B-Gym API executando em http://localhost:${PORT}`);
});
