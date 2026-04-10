describe("ATD-54 - Registro de novo usuario", () => {
  let user;

  beforeEach(() => {
    cy.visitAuthPage();
    cy.createUserData().then((createdUser) => {
      user = createdUser;
    });
  });

  it("ATD-73: registra novo usuario com dados validos", () => {
    cy.openRegistrationForm();
    cy.fillRegistrationForm(user);
    cy.contains("button", "Cadastrar").click();

    cy.get(".feedback.success")
      .should("contain", "Usuario cadastrado com sucesso.")
      .and("contain", "Agora faca login para abrir seu treino do dia.");
    cy.contains("button", "Entrar").should("have.class", "active");
  });

  it("ATD-74: impede cadastro com e-mail ja registrado", () => {
    cy.openRegistrationForm();
    cy.fillRegistrationForm(user);
    cy.contains("button", "Cadastrar").click();

    cy.openRegistrationForm();
    cy.fillRegistrationForm({
      ...user,
      name: `${user.name} duplicado`,
    });
    cy.contains("button", "Cadastrar").click();

    cy.get(".feedback.error").should(
      "contain",
      "Ja existe um usuario cadastrado com este e-mail."
    );
  });

  it("ATD-75: valida obrigatoriedade dos campos no cadastro", () => {
    cy.openRegistrationForm();
    cy.contains("button", "Cadastrar").click();

    cy.assertNativeValidation("name", "valueMissing");
    cy.assertNativeValidation("email", "valueMissing");
    cy.assertNativeValidation("password", "valueMissing");
    cy.get(".feedback").should("not.exist");
  });

  it("ATD-76: valida formato do e-mail no cadastro", () => {
    cy.openRegistrationForm();
    cy.fillRegistrationForm({
      ...user,
      email: "email-invalido",
    });
    cy.contains("button", "Cadastrar").click();

    cy.assertNativeValidation("email", "typeMismatch");
    cy.get(".feedback").should("not.exist");
  });

  it("ATD-77: valida tamanho minimo da senha no cadastro", () => {
    cy.openRegistrationForm();
    cy.fillRegistrationForm({
      ...user,
      password: "1234567",
    });
    cy.contains("button", "Cadastrar").click();

    cy.get('input[name="password"]').should("have.attr", "minlength", "8");
    cy.get(".feedback.error").should("contain", "O campo password deve ter no minimo 8 caracteres.");
  });

  it("ATD-78: autentica usuario com as credenciais geradas apos o cadastro", () => {
    cy.openRegistrationForm();
    cy.fillRegistrationForm(user);
    cy.contains("button", "Cadastrar").click();

    cy.get('input[name="email"]').should("have.value", user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.contains("button", "Acessar treino").click();

    cy.contains("h1", "Seu treino de hoje, sem telas sobrando.").should("be.visible");
    cy.contains(".user-chip", user.email).should("be.visible");
    cy.contains("h3", "Lista do treino").should("be.visible");
  });
});
