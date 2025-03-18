import { createRequest, createResponse } from "node-mocks-http";
import { hasAccess, validateBudgetExists } from "../../../middleware/budget";
import Budget from "../../../models/Budget";
import { budgets } from "../../mocks/budget";
jest.mock("../../../models/Budget", () => ({
  findByPk: jest.fn(),
}));

describe("budget - validateBudgetExists", () => {
  it("should return 404 if budget does not exist", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(null);
    const req = createRequest({
      params: {
        budgetId: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();

    await validateBudgetExists(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual({
      message: "Presupuesto no encontrado",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("Should proceed to the next middleware if the budget exists", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);
    const req = createRequest({
      params: {
        budgetId: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();

    await validateBudgetExists(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.budget).toStrictEqual(budgets[0]);
  });

  it("should return 500 if there is an error", async () => {
    (Budget.findByPk as jest.Mock).mockRejectedValue("Error");
    const req = createRequest({
      params: {
        budgetId: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();

    await validateBudgetExists(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual({
      message: "Error en el servidor",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("budget - hasAccess", () => {
  it("should return 403 if the user does not have access", async () => {
    const req = createRequest({
      user: { id: 2 },
      budget: { userId: 1 },
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

  it("Should proceed to the next middleware if the user has access", async () => {
    const req = createRequest({
      user: { id: 1 },
      budget: { userId: 1 },
    });
    const res = createResponse();
    const next = jest.fn();

    hasAccess(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
