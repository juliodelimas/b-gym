const { expect } = require("chai");
const request = require("supertest");

const { loadFixture } = require("../helpers/fixtures");
const { startApiServer, stopApiServer } = require("../helpers/apiServer");

describe("ATD-65 - Impedir cadastro com e-mail ja registrado", () => {
  let api;

  beforeEach(async () => {
    api = await startApiServer();
  });

  afterEach(async () => {
    await stopApiServer(api?.server);
  });

  it("retorna conflito ao tentar cadastrar o mesmo e-mail duas vezes", async () => {
    const fixture = loadFixture("ATD-65.json");

    await request(api.baseUrl)
      .post("/api/auth/register")
      .send(fixture.firstRequest)
      .expect(201);

    const response = await request(api.baseUrl)
      .post("/api/auth/register")
      .send(fixture.secondRequest)
      .expect(fixture.expected.status);

    expect(response.body).to.deep.equal({
      code: fixture.expected.code,
      message: fixture.expected.message,
    });
  });
});
