function authMiddleware(authService) {
  return (req, res, next) => {
    const authorizationHeader = req.headers.authorization || "";

    if (!authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Acesso nao autorizado.",
      });
    }

    const token = authorizationHeader.slice("Bearer ".length).trim();
    const user = authService.verifyToken(token);

    if (!user) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Acesso nao autorizado.",
      });
    }

    req.user = user;
    return next();
  };
}

module.exports = {
  authMiddleware,
};
