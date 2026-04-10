const { expect } = require("chai");
const request = require("supertest");

const { loadFixture } = require("../helpers/fixtures");
const { startApiServer, stopApiServer } = require("../helpers/apiServer");

describe("ATD-66 - Validar campos obrigatorios e formato no cadastro", () => {
  let api;

  beforeEach(async () => {
    api = await startApiServer();
  });

  afterEach(async () => {
    await stopApiServer(api?.server);
  });

  it("retorna erro de validacao com detalhes dos campos invalidos", async () => {
    const fixture = loadFixture("ATD-66.json");

    const response = await request(api.baseUrl)
      .post("/api/auth/register")
      .send(fixture.request)
      .expect(fixture.expected.status);

    expect(response.body.code).to.equal(fixture.expected.code);
    expect(response.body.message).to.equal(fixture.expected.message);
    expect(response.body.details).to.be.an("array").and.not.empty;

    const fields = response.body.details.map((detail) => detail.field);

    expect(fields).to.include.members(fixture.expected.detailFields);
    expect(response.body.details).to.deep.include({
      field: "email",
      message: "O campo e-mail deve conter um endereco valido.",
    });
  });
});
