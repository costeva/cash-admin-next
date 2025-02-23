import type { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class budgetController {
  // se crean los métodos para la API
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [
          ["createdAt", "DESC"],
          //TODO: filtrar por usuario autenticado
        ],
      });
      res.status(200).json({ budgets });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body);
      await budget.save();
      res.status(201).json({ budget });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  };

  static getOne = async (req: Request, res: Response) => {
    // Cuando encuentra incluye los gastos tambien en la respuesta con el metodo include
    const budget = await Budget.findByPk(req.params.budgetId, {
      include: [Expense],
    });
    res.json(req.budget);
  };

  static update = async (req: Request, res: Response) => {
    await req.budget.update(req.body);
    res.status(200).json({ data: req.budget });
  };

  static delete = async (req: Request, res: Response) => {
    await req.budget.destroy();
    res.json("Presupuesto eliminado");
  };
}
