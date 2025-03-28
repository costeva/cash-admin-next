import type { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class budgetController {
  // se crean los métodos para la API
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [["createdAt", "DESC"]],
        where: {
          userId: req.user.id,
        },
      });
      res.status(200).json({ budgets });
      return;
    } catch (error) {
      res.status(500).json({ error: "Error en el servidor" });
      return;
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const budget = await Budget.create(req.body);
      budget.userId = Number(req.user.id);
      await budget.save();
      res.status(201).json({ message: "Presupuesto Creado Exitosamente" });
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      return;
    }
  };

  static getOne = async (req: Request, res: Response) => {
    // Cuando encuentra incluye los gastos tambien en la respuesta con el metodo include
    const budget = await Budget.findByPk(req.budget.id, {
      include: [Expense],
    });

    res.json(budget);
  };

  static update = async (req: Request, res: Response) => {
    await req.budget.update(req.body);
    res.status(200).json({ message: "Presupuesto actualizado" });
  };

  static delete = async (req: Request, res: Response) => {
    await req.budget.destroy();
    res.json({ message: "Presupuesto eliminado" });
  };
}
