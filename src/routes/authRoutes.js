const express = require("express");

const { validateLogin, validateRegister } = require("../middleware/validate");

function createAuthRoutes(authService) {
  const router = express.Router();

  router.post("/register", validateRegister, (req, res) => {
    const result = authService.register(req.body);
    res.status(result.status).json(result.body);
  });

  router.post("/login", validateLogin, (req, res) => {
    const result = authService.login(req.body);
    res.status(result.status).json(result.body);
  });

  return router;
}

module.exports = {
  createAuthRoutes,
};
