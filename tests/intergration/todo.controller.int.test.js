const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mockData/newTodo.json");

const endpointUrl = "/todos/";
let firstTodo, newTodoId;

describe(endpointUrl, () => {
  it(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();

    firstTodo = response.body[0];
  });

  it(`GET by id ${endpointUrl} :todoId`, async () => {
    const response = await request(app).get(endpointUrl + firstTodo._id);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  it(`GET id doesn't exist ${endpointUrl} :todoId`, async () => {
    const response = await request(app).get(
      endpointUrl + "618ce43b13ffb21adee45a67"
    );

    expect(response.statusCode).toBe(404);
  });

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);

    newTodoId = response.body._id;
  });

  it(`should return error 500 on POST with invalid data ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ title: "Missing done property." });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Todo validation failed: done: Path `done` is required."
    });
  });

  it(`PUT ${endpointUrl}`, async () => {
    const testData = { title: "PUT test.", done: true };
    const response = await request(app)
      .put(endpointUrl + newTodoId)
      .send(testData);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
    expect(response.body.done).toBe(testData.done);
  });

  it(`PUT id doesn't exist ${endpointUrl} :todoId`, async () => {
    const testData = { title: "PUT test.", done: true };
    const response = await request(app)
      .put(endpointUrl + "618ce43b13ffb21adee45a67")
      .send(testData);

    expect(response.statusCode).toBe(404);
  });

  it(`DELETE ${endpointUrl}`, async () => {
    const response = await request(app)
      .put(endpointUrl + newTodoId)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBeDefined();
    expect(response.body.done).toBeDefined();
  });

  it(`DELETE id doesn't exist ${endpointUrl} :todoId`, async () => {
    const response = await request(app)
      .put(endpointUrl + "618ce43b13ffb21adee45a67")
      .send();

    expect(response.statusCode).toBe(404);
  });
});
