import type { Request, Response } from "express";
import Budget from "../models/Budget";

export class budgetController {
  // se crean los métodos para la API
  static getAll = async (req: Request, res: Response) => {
    console.log("desde budgets");
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
    console.log("desde GET budgets/:id");
  };

  static update = async (req: Request, res: Response) => {
    console.log("desde PUT budgets/:id");
  };

  static delete = async (req: Request, res: Response) => {
    console.log("desde DELETE budgets/:id");
  };
}
