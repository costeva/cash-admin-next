import { createRequest, createResponse } from "node-mocks-http";
import {
  validateExpenseId,
  validateExpenseExists,
  validateExpenseInput,
} from "../../../middleware/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";
import { hasAccess } from "../../../middleware/budget";
import { budgets } from "../../mocks/budget";

jest.mock("../../../models/Expense", () => ({
  findByPk: jest.fn(),
}));

describe("Expenses Middelware - validateExpenseExists", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (Expense.findByPk as jest.Mock).mockImplementation((id: number) => {
      const expense = expenses.find((expense) => expense.id === id) ?? null;
      return Promise.resolve(expense);
    });
  });
  it("should return 404 if expense does not exist", async () => {
    const req = createRequest({
      params: {
        expenseId: 120,
      },
    });
    const res = createResponse();
    const next = jest.fn();
    await validateExpenseExists(req, res, next);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data).toStrictEqual({ message: "Gasto No Encontrado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should proceed to the next middleware if the expense exists", async () => {
    const req = createRequest({
      params: {
        expenseId: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();
    await validateExpenseExists(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.expense).toStrictEqual(expenses[0]);
  });

  it("should return 500 if there is an error", async () => {
    (Expense.findByPk as jest.Mock).mockRejectedValue("Error");
    const req = createRequest({
      params: {
        expenseId: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();
    await validateExpenseExists(req, res, next);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(data).toStrictEqual({ message: "Error en el servidor" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should prevent unauthorized user from adding an expense", async () => {
    const req = createRequest({
      method: "POST",
      url: "api/budgets/budgetId/expenses",
      user: { id: 20 },
      body: { name: "test", amount: 100 },
      budget: budgets[0],
    });
    const res = createResponse();
    const next = jest.fn();

    hasAccess(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual({
      message: "No tienes acceso a este presupuesto",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
