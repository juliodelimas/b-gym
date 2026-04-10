const { expect } = require("chai");
const request = require("supertest");

const { loadFixture } = require("../helpers/fixtures");
const { startApiServer, stopApiServer } = require("../helpers/apiServer");

describe("ATD-67 - Autenticar usuario com credenciais geradas apos o cadastro", () => {
  let api;

  beforeEach(async () => {
    api = await startApiServer();
  });

  afterEach(async () => {
    await stopApiServer(api?.server);
  });

  it("permite autenticar com as credenciais criadas no cadastro", async () => {
    const fixture = loadFixture("ATD-67.json");

    const registerResponse = await request(api.baseUrl)
      .post("/api/auth/register")
      .send(fixture.registerRequest)
      .expect(201);

    const loginResponse = await request(api.baseUrl)
      .post("/api/auth/login")
      .send(fixture.loginRequest)
      .expect(fixture.expected.status);

    expect(loginResponse.body.accessToken).to.be.a("string").and.not.empty;
    expect(loginResponse.body.tokenType).to.equal(fixture.expected.tokenType);
    expect(loginResponse.body.expiresIn).to.equal(fixture.expected.expiresIn);
    expect(loginResponse.body.user).to.include({
      id: registerResponse.body.user.id,
      name: fixture.expected.name,
      email: fixture.expected.email,
    });
  });
});
