const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../app");
const request = require("./helpers");

test("Welcome route returns JSON", async () => {
  assert.deepEqual(await request(app, "GET", "/"), {
    status: 200,
    body: { message: "Welcome to contact book application." },
  });
});

for (const [method, url, handler] of [
  ["GET", "/api/contacts", "findAll"],
  ["POST", "/api/contacts", "create"],
  ["DELETE", "/api/contacts", "deleteAll"],
  ["GET", "/api/contacts/favorite", "findAllFavorite"],
  ["GET", "/api/contacts/1", "findOne"],
  ["PUT", "/api/contacts/1", "update"],
  ["DELETE", "/api/contacts/1", "delete"],
]) {
  test(`${method} ${url} reaches ${handler}`, async () => {
    assert.deepEqual(await request(app, method, url), {
      status: 200,
      body: { message: `${handler} handler` },
    });
  });
}

test("Error middleware preserves the JSON 404 response", async () => {
  assert.deepEqual(await request(app, "GET", "/unknown"), {
    status: 404,
    body: { message: "Resource not found" },
  });
});
