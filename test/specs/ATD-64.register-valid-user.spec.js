const { expect } = require("chai");
const request = require("supertest");

const { loadFixture } = require("../helpers/fixtures");
const { startApiServer, stopApiServer } = require("../helpers/apiServer");

describe("ATD-64 - Registrar novo usuario com dados validos", () => {
  let api;

  beforeEach(async () => {
    api = await startApiServer();
  });

  afterEach(async () => {
    await stopApiServer(api?.server);
  });

  it("cadastra um novo usuario com sucesso via HTTP", async () => {
    const fixture = loadFixture("ATD-64.json");

    const response = await request(api.baseUrl)
      .post("/api/auth/register")
      .send(fixture.request)
      .expect(fixture.expected.status);

    expect(response.body.message).to.equal(fixture.expected.message);
    expect(response.body.user).to.include({
      name: fixture.request.name,
      email: fixture.expected.email,
    });
    expect(response.body.user.id).to.be.a("string").and.not.empty;
    expect(response.body.user.createdAt).to.be.a("string");
  });
});
