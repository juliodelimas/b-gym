function createUserData() {
  const nonce = `${Date.now()}-${Cypress._.random(1000, 9999)}`;

  return {
    name: `Usuario ATD 54 ${nonce}`,
    email: `atd54-${nonce}@example.com`,
    password: "segredo123",
  };
}

function openRegistrationForm() {
  cy.contains("button", "Criar conta").click();
  cy.contains("button", "Criar conta").should("have.class", "active");
}

function fillRegistrationForm({ name, email, password }) {
  cy.get('input[name="name"]').clear().type(name);
  cy.get('input[name="email"]').clear().type(email);
  cy.get('input[name="password"]').clear().type(password);
}

describe("ATD-54 - Registro de novo usuario", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it("ATD-73: registra novo usuario com dados validos", () => {
    const user = createUserData();

    openRegistrationForm();
    fillRegistrationForm(user);
    cy.contains("button", "Cadastrar").click();

    cy.get(".feedback.success")
      .should("contain", "Usuario cadastrado com sucesso.")
      .and("contain", "Agora faca login para abrir seu treino do dia.");
    cy.contains("button", "Entrar").should("have.class", "active");
  });

  it("ATD-74: impede cadastro com e-mail ja registrado", () => {
    const user = createUserData();

    openRegistrationForm();
    fillRegistrationForm(user);
    cy.contains("button", "Cadastrar").click();

    openRegistrationForm();
    fillRegistrationForm({
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
    openRegistrationForm();
    cy.contains("button", "Cadastrar").click();

    cy.get('input[name="name"]').then(($input) => {
      expect($input[0].validity.valueMissing).to.equal(true);
      expect($input[0].validationMessage).not.to.equal("");
    });

    cy.get('input[name="email"]').then(($input) => {
      expect($input[0].validity.valueMissing).to.equal(true);
      expect($input[0].validationMessage).not.to.equal("");
    });

    cy.get('input[name="password"]').then(($input) => {
      expect($input[0].validity.valueMissing).to.equal(true);
      expect($input[0].validationMessage).not.to.equal("");
    });

    cy.get(".feedback").should("not.exist");
  });

  it("ATD-76: valida formato do e-mail no cadastro", () => {
    openRegistrationForm();
    fillRegistrationForm({
      ...createUserData(),
      email: "email-invalido",
    });
    cy.contains("button", "Cadastrar").click();

    cy.get('input[name="email"]').then(($input) => {
      expect($input[0].validity.typeMismatch).to.equal(true);
      expect($input[0].validationMessage).not.to.equal("");
    });

    cy.get(".feedback").should("not.exist");
  });

  it("ATD-77: valida tamanho minimo da senha no cadastro", () => {
    openRegistrationForm();
    fillRegistrationForm({
      ...createUserData(),
      password: "1234567",
    });
    cy.contains("button", "Cadastrar").click();

    cy.get('input[name="password"]').then(($input) => {
      expect($input[0].validity.tooShort).to.equal(true);
      expect($input[0].validationMessage).not.to.equal("");
    });

    cy.get(".feedback").should("not.exist");
  });

  it("ATD-78: autentica usuario com as credenciais geradas apos o cadastro", () => {
    const user = createUserData();

    openRegistrationForm();
    fillRegistrationForm(user);
    cy.contains("button", "Cadastrar").click();

    cy.get('input[name="email"]').should("have.value", user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.contains("button", "Acessar treino").click();

    cy.contains("h1", "Seu treino de hoje, sem telas sobrando.").should("be.visible");
    cy.contains(".user-chip", user.email).should("be.visible");
    cy.contains("h3", "Lista do treino").should("be.visible");
  });
});
