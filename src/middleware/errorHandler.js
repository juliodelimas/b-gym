function notFoundHandler(req, res) {
  res.status(404).json({
    code: "RESOURCE_NOT_FOUND",
    message: "Recurso nao encontrado.",
  });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Ocorreu um erro interno no servidor.",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
