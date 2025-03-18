import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../../mocks/budget";
import { budgetController } from "../../../controllers/budgetController";
import Budget from "../../../models/Budget";
import Expense from "../../../models/Expense";

jest.mock("../../../models/Budget", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

describe("BudgetController", () => {
  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset();
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const filterBudgets = budgets.filter(
        (budget) => budget.userId === Number(options.where.userId)
      );
      return Promise.resolve(filterBudgets);
    });
  });
  it("should return 2 budgets", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 1 },
    });
    const res = createResponse();

    await budgetController.getAll(req, res);

    const data = res._getJSONData();
    expect(data.budgets).toHaveLength(2);

    expect(res.statusCode).toBe(200);
  });

  it("should return 1 budgets", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 2 },
    });
    const res = createResponse();

    const filterBudgets = budgets.filter(
      (budget) => budget.userId === Number(req.user.id)
    );

    (Budget.findAll as jest.Mock).mockResolvedValue(filterBudgets);
    await budgetController.getAll(req, res);

    const data = res._getJSONData();
    expect(data.budgets).toHaveLength(1);

    expect(res.statusCode).toBe(200);
  });

  it("should return 0 budgets", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 10 },
    });
    const res = createResponse();

    const filterBudgets = budgets.filter(
      (budget) => budget.userId === Number(req.user.id)
    );

    (Budget.findAll as jest.Mock).mockResolvedValue(filterBudgets);
    await budgetController.getAll(req, res);

    const data = res._getJSONData();
    expect(data.budgets).toHaveLength(0);

    expect(res.statusCode).toBe(200);
  });

  it("should handle error when fetching budgets", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 1 },
    });
    const res = createResponse();
    (Budget.findAll as jest.Mock).mockRejectedValue(
      new Error("Error en el servidor")
    );
    await budgetController.getAll(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data.error).toBe("Error en el servidor");
  });
});

describe("BudgetController.create", () => {
  it("Should create a budget response with statysCode201", async () => {
    const muckBudget = {
      save: jest.fn().mockResolvedValue(true),
    };
    (Budget.create as jest.Mock).mockResolvedValue(muckBudget);
    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: { id: 1 },
      body: {
        name: "Budget 1",
        amount: 1000,
        description: "Budget 1 description",
      },
    });
    const res = createResponse();

    await budgetController.create(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(data.message).toBe("Presupuesto Creado Exitosamente");
    expect(muckBudget.save).toHaveBeenCalled();
    expect(muckBudget.save).toHaveBeenCalledTimes(1);
    expect(Budget.create).toHaveBeenCalledWith(req.body);
  });

  it("Should create a budget response with statysCode 500", async () => {
    const muckBudget = {
      save: jest.fn(),
    };
    (Budget.create as jest.Mock).mockResolvedValue(true);

    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: { id: 1 },
      body: {
        name: "Budget 1",
        amount: 1000,
        description: "Budget 1 description",
      },
    });
    const res = createResponse();

    await budgetController.create(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data.error).toBe("Hubo un error");
    expect(muckBudget.save).not.toHaveBeenCalled();
    expect(Budget.create).toHaveBeenCalledWith(req.body);
  });
});

describe("BudgetController.getOne", () => {
  beforeEach(() => {
    (Budget.findByPk as jest.Mock).mockImplementation((id) => {
      const budget = budgets.find((budget) => budget.id === id);
      return Promise.resolve(budget);
    });
  });
  it("Should return a budget with status code 200 ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/1",
      budget: { id: 1 },
    });
    const res = createResponse();

    await budgetController.getOne(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(3);
    expect(Budget.findByPk).toHaveBeenCalledTimes(1);
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
      include: [Expense],
    });
  });

  it("Should return a budget with status code 200 ID 2", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/2",
      budget: { id: 2 },
    });
    const res = createResponse();

    await budgetController.getOne(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(2);
  });

  it("Should return a budget with status code 200 ID 3", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/3",
      budget: { id: 3 },
    });
    const res = createResponse();

    await budgetController.getOne(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(0);
  });
});

describe("BudgetController.update", () => {
  it("Should update a budget with status code 200", async () => {
    const muckBudget = {
      update: jest.fn().mockResolvedValue(true),
    };
    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/1",
      budget: muckBudget,
      body: {
        name: "Budget 1",
        amount: 1000,
        description: "Budget 1 description",
      },
    });
    const res = createResponse();

    await budgetController.update(req, res);
    const data = res._getJSONData();

    console.log(data);
    expect(res.statusCode).toBe(200);
    expect(data.message).toBe("Presupuesto actualizado");
    expect(muckBudget.update).toHaveBeenCalledTimes(1);
    expect(muckBudget.update).toHaveBeenCalledWith(req.body);
  });
});

describe("BudgetController.delete", () => {
  it("Should delete a budget with status code 200", async () => {
    const muckBudget = {
      destroy: jest.fn().mockResolvedValue(true),
    };
    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/1",
      budget: muckBudget,
    });
    const res = createResponse();

    await budgetController.delete(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.message).toBe("Presupuesto eliminado");
    expect(muckBudget.destroy).toHaveBeenCalledTimes(1);
    expect(muckBudget.destroy).toHaveBeenCalledTimes(1);
  });
});
