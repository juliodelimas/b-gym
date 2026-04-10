const jwt = require("jsonwebtoken");

const { JWT_SECRET, TOKEN_EXPIRATION_SECONDS } = require("../config");

class AuthService {
  constructor(store) {
    this.store = store;
  }

  register(input) {
    if (this.store.findUserByEmail(input.email)) {
      return {
        status: 409,
        body: {
          code: "EMAIL_ALREADY_REGISTERED",
          message: "Ja existe um usuario cadastrado com este e-mail.",
        },
      };
    }

    const user = this.store.createUser(input);

    return {
      status: 201,
      body: {
        message: "Usuario cadastrado com sucesso.",
        user: this.serializeUser(user, true),
      },
    };
  }

  login({ email, password }) {
    const user = this.store.validateCredentials(email, password);

    if (!user) {
      return {
        status: 401,
        body: {
          code: "INVALID_CREDENTIALS",
          message: "E-mail ou senha invalidos.",
        },
      };
    }

    const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION_SECONDS,
    });

    this.store.saveSession(accessToken, user.id);

    return {
      status: 200,
      body: {
        accessToken,
        tokenType: "Bearer",
        expiresIn: TOKEN_EXPIRATION_SECONDS,
        user: this.serializeUser(user),
      },
    };
  }

  verifyToken(token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const userIdFromSession = this.store.findUserIdBySession(token);

      if (!userIdFromSession || userIdFromSession !== payload.sub) {
        return null;
      }

      return this.store.findUserById(payload.sub);
    } catch {
      return null;
    }
  }

  serializeUser(user, includeCreatedAt = false) {
    const base = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    if (includeCreatedAt) {
      base.createdAt = user.createdAt;
    }

    return base;
  }
}

module.exports = {
  AuthService,
};
