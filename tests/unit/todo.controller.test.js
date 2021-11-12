const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mockData/newTodo.json");
const allTodos = require("../mockData/allTodos.json");

TodoModel.find = jest.fn();
TodoModel.create = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("TodoController.getTodos", () => {
  it("should have a getTodos function", () => {
    expect(typeof TodoController.getTodos).toBe("function");
  });

  it("should call TodoModel.find({})", async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });

  it("should return response with status 200 and all todos", async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBe(true);
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });

  it("should handle errors", async () => {
    const errorMssage = { message: "Something wrong." };
    TodoModel.find.mockRejectedValue(errorMssage);
    await TodoController.getTodos(req, res, next);
    expect(next).toBeCalledWith(errorMssage);
  });
});

describe("TodoController.createTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  it("should have a createTodo function", () => {
    expect(typeof TodoController.createTodo).toBe("function");
  });

  it("should call TodaModel.create", async () => {
    await TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it("should return 201 response code", async () => {
    await TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBe(true);
  });

  it("should return json body in response", async () => {
    TodoModel.create.mockReturnValue(newTodo);

    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMssage = { message: "Done property missing" };
    TodoModel.create.mockRejectedValue(errorMssage);
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMssage);
  });
});
