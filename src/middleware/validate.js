function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function collectStringValidation(details, field, value, options) {
  if (typeof value !== "string") {
    details.push({ field, message: `O campo ${field} deve ser uma string.` });
    return;
  }

  if (options.trim !== false && value.trim().length === 0) {
    details.push({ field, message: `O campo ${field} nao pode estar vazio.` });
  }

  if (options.minLength && value.trim().length < options.minLength) {
    details.push({
      field,
      message: `O campo ${field} deve ter no minimo ${options.minLength} caracteres.`,
    });
  }

  if (options.maxLength && value.trim().length > options.maxLength) {
    details.push({
      field,
      message: `O campo ${field} deve ter no maximo ${options.maxLength} caracteres.`,
    });
  }

  if (options.email && !isEmail(value.trim())) {
    details.push({
      field,
      message: "O campo e-mail deve conter um endereco valido.",
    });
  }
}

function validationError(res, details) {
  return res.status(422).json({
    code: "VALIDATION_ERROR",
    message: "Existem erros de validacao na requisicao.",
    details,
  });
}

function validateRegister(req, res, next) {
  const details = [];
  const { name, email, password } = req.body || {};

  collectStringValidation(details, "name", name, { minLength: 3, maxLength: 120 });
  collectStringValidation(details, "email", email, { email: true });
  collectStringValidation(details, "password", password, { minLength: 8, maxLength: 64 });

  if (details.length > 0) {
    return validationError(res, details);
  }

  return next();
}

function validateLogin(req, res, next) {
  const details = [];
  const { email, password } = req.body || {};

  collectStringValidation(details, "email", email, { email: true });
  collectStringValidation(details, "password", password, { minLength: 8, maxLength: 64 });

  if (details.length > 0) {
    return validationError(res, details);
  }

  return next();
}

function validateCompletionUpdate(req, res, next) {
  const { completed } = req.body || {};

  if (typeof completed !== "boolean") {
    return validationError(res, [
      {
        field: "completed",
        message: "O campo completed deve ser booleano.",
      },
    ]);
  }

  return next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateCompletionUpdate,
};
