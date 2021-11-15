const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mockData/newTodo.json");
const allTodos = require("../mockData/allTodos.json");

TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.create = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();

let req, res, next;
let todoId = "618ce43b13ffb21adee45a6f";
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

describe("TodoController.getTodoById", () => {
  it("should have a getTodoById function", () => {
    expect(typeof TodoController.getTodoById).toBe("function");
  });

  it("should call TodoModel.findById with route parameters", async () => {
    req.params.todoId = todoId;
    await TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toBeCalledWith(todoId);
  });

  it("should return response with status 200 and json body", async () => {
    TodoModel.findById.mockReturnValue(newTodo);

    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBe(true);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMssage = { message: "Something wrong." };
    TodoModel.findById.mockRejectedValue(errorMssage);
    await TodoController.getTodoById(req, res, next);
    expect(next).toBeCalledWith(errorMssage);
  });

  it("should return status 404 when item does not exist", async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBe(true);
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

describe("TodoController.updateTodo", () => {
  it("should have a updateTodo function", () => {
    expect(typeof TodoController.updateTodo).toBe("function");
  });

  it("should update with TodoModel.findByIdAndUpdate", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    await TodoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false
    });
  });

  it("should return a response with json data and 200 response code", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req, res, next);
    expect(res._isEndCalled()).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMssage = { message: "Something wrong." };
    TodoModel.findByIdAndUpdate.mockRejectedValue(errorMssage);
    await TodoController.updateTodo(req, res, next);
    expect(next).toBeCalledWith(errorMssage);
  });

  it("should return status 404 when item does not exist", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBe(true);
  });
});
