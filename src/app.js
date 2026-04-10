const express = require("express");
const fs = require("fs");
const path = require("path");

const { AuthService } = require("./services/authService");
const { WorkoutService } = require("./services/workoutService");
const { MemoryStore } = require("./store/memoryStore");
const { authMiddleware } = require("./middleware/authMiddleware");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { createAuthRoutes } = require("./routes/authRoutes");
const { createWorkoutRoutes } = require("./routes/workoutRoutes");

function renderSwaggerUiHtml() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>B-Gym API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body {
        margin: 0;
        background: #f6f7fb;
      }

      .topbar {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/docs/swagger.yaml",
        dom_id: "#swagger-ui"
      });
    </script>
  </body>
</html>`;
}

function createApp() {
  const app = express();
  const store = new MemoryStore();
  const authService = new AuthService(store);
  const workoutService = new WorkoutService(store);
  const distPath = path.resolve(__dirname, "..", "dist");
  const distIndexPath = path.join(distPath, "index.html");

  app.use(express.json());

  app.get("/docs", (req, res) => {
    res.type("html").send(renderSwaggerUiHtml());
  });

  app.use("/docs", express.static("docs"));
  app.use("/api/auth", createAuthRoutes(authService));
  app.use("/api/me", authMiddleware(authService), createWorkoutRoutes(workoutService));

  if (fs.existsSync(distIndexPath)) {
    app.use(express.static(distPath));

    app.get(/^(?!\/api|\/docs).*/, (req, res) => {
      res.sendFile(distIndexPath);
    });
  } else {
    app.get("/", (req, res) => {
      res.json({
        name: "B-Gym Daily Workout API",
        version: "1.0.0",
        docs: "/docs",
        openApi: "/docs/swagger.yaml",
        basePath: "/api",
        webApp: "Execute `npm run build` para publicar a interface React.",
      });
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};
