const request = require("supertest");
const app = require("../app");

describe("app", () => {
  it("should test the app", () => {
    expect(1).toBe(1);
  });

  it("should test for base route", async() => {
    const { body, statusCode } = await request(app).get("/")
  })
});
