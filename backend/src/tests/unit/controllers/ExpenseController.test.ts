import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { ExpensesController } from "../../../controllers/ExpenseController";
import { expenses } from "../../mocks/expenses";

jest.mock("../../../models/Expense", () => ({
  create: jest.fn(),
}));

describe("ExpensesController.create", () => {
  it("should create a new expense", async () => {
    const expenseMock = {
      save: jest.fn(),
    };
    (Expense.create as jest.Mock).mockResolvedValue(expenseMock);
    const req = createRequest({
      method: "POST",
      url: "/:budgetId/expenses",
      body: {
        name: "Test",
        amount: 100,
      },
      budget: {
        id: 1,
      },
    });
    const res = createResponse();
    await ExpensesController.create(req, res);
    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data.message).toBe("Gasto creado exitosamente");
    expect(expenseMock.save).toHaveBeenCalled();
    expect(expenseMock.save).toHaveBeenCalledTimes(1);
    expect(Expense.create).toHaveBeenCalledWith(req.body);
  });

  it("should return 500 if there is an error", async () => {
    const expenseMock = {
      save: jest.fn().mockResolvedValue(true),
    };
    (Expense.create as jest.Mock).mockRejectedValue(new Error());
    const req = createRequest({
      method: "POST",
      url: "/:budgetId/expenses",
      body: {
        name: "Test",
        amount: 100,
      },
      budget: {
        id: 1,
      },
    });
    const res = createResponse();
    await ExpensesController.create(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(data.message).toBe("Error en el servidor");
    expect(expenseMock.save).not.toHaveBeenCalled();
  });
});

describe("ExpensesController.getOne", () => {
  it("should return the expense ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/:budgetId/expenses/:expenseId",
      expense: expenses[0],
    });
    const res = createResponse();
    await ExpensesController.getOne(req, res);
    const data = res._getJSONData();
    expect(data.id).toBe(1);
    expect(data).toStrictEqual(expenses[0]);
  });
});

describe("ExpensesController.update", () => {
  const expenseMock = {
    ...expenses[0],
    update: jest.fn(),
  };
  it("should update the expense ID 1", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/:budgetId/expenses/:expenseId",
      body: {
        name: "Test",
        amount: 100,
      },
      expense: expenseMock,
    });
    const res = createResponse();
    await ExpensesController.update(req, res);
    const data = res._getJSONData();
    expect(data.message).toEqual("Gasto Actualizado Exitosamente");
    expect(expenseMock.update).toHaveBeenCalled();
    expect(expenseMock.update).toHaveBeenCalledTimes(1);
    expect(expenseMock.update).toHaveBeenCalledWith(req.body);
  });
});

describe("ExpensesController.delete", () => {
  const expenseMock = {
    ...expenses[0],
    destroy: jest.fn(),
  };
  it("should delete the expense ID 1", async () => {
    const req = createRequest({
      method: "DELETE",
      url: "/:budgetId/expenses/:expenseId",
      expense: expenseMock,
    });
    const res = createResponse();
    await ExpensesController.delete(req, res);
    const data = res._getJSONData();
    expect(data.message).toEqual("Gasto Eliminado Exitosamente");
    expect(expenseMock.destroy).toHaveBeenCalled();
    expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
  });
});
