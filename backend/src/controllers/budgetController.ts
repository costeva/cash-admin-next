import type { Request, Response } from "express";
import Budget from "../models/Budget";

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
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);
      if (budget) {
        res.status(200).json({ budget });
      } else {
        res.status(404).json({ message: "Presupuesto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  };

  static update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);
      if (budget) {
        await budget.update(req.body);
        res.status(200).json({ budget });
      } else {
        res.status(404).json({ message: "Presupuesto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);
      if (budget) {
        await budget.destroy();
        res.status(204).json();
      } else {
        res.status(404).json({ message: "Presupuesto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
}
