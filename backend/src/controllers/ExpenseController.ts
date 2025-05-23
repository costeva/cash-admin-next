import type { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpensesController {
  static getAll = async (req: Request, res: Response) => {};

  static create = async (req: Request, res: Response) => {
    try {
      const expense = await Expense.create(req.body);
      expense.budgetId = req.budget.id;
      await expense.save();
      res.status(201).json({ expense, message: "Gasto creado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  };

  static getOne = async (req: Request, res: Response) => {
    res.json(req.expense);
  };

  static update = async (req: Request, res: Response) => {
    await req.expense.update(req.body);
    res.json({
      expense: req.expense,
      message: "Gasto Actualizado Exitosamente",
    });
  };

  static delete = async (req: Request, res: Response) => {
    await req.expense.destroy();
    res.json({ message: "Gasto Eliminado Exitosamente" });
  };
}
