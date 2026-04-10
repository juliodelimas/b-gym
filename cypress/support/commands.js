Cypress.Commands.add("visitAuthPage", () => {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.clear();
    },
  });
});

Cypress.Commands.add("createUserData", () => {
  const nonce = `${Date.now()}-${Cypress._.random(1000, 9999)}`;

  return cy.wrap({
    name: `Usuario ATD 54 ${nonce}`,
    email: `atd54-${nonce}@example.com`,
    password: "segredo123",
  });
});

Cypress.Commands.add("openRegistrationForm", () => {
  cy.contains("button", "Criar conta").click();
  cy.contains("button", "Criar conta").should("have.class", "active");
});

Cypress.Commands.add("fillRegistrationForm", ({ name, email, password }) => {
  cy.get('input[name="name"]').clear().type(name);
  cy.get('input[name="email"]').clear().type(email);
  cy.get('input[name="password"]').clear().type(password);
});

Cypress.Commands.add("assertNativeValidation", (fieldName, validityKey) => {
  cy.get(`input[name="${fieldName}"]`).then(($input) => {
    const input = $input[0];

    input.reportValidity();

    if (validityKey) {
      expect(input.validity[validityKey]).to.equal(true);
    }

    expect(input.validity.valid).to.equal(false);
    expect(input.validationMessage).not.to.equal("");
  });
});
