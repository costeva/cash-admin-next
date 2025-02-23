import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Expense from "../models/Expense";

declare global {
  namespace Express {
    export interface Request {
      expense?: Expense;
    }
  }
}

export const validateExpenseInput = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre del gasto no puede estar vacio")
    .run(req);
  await body("amount")
    .notEmpty()
    .withMessage("La cantidad del gasto no puede estar vacia")
    .isNumeric()
    .withMessage("La cantidad del gasto debe ser un número")
    .custom((value) => value > 0)
    .withMessage("El gasto debe ser mayor a 0")
    .run(req);
  await body("description")
    .notEmpty()
    .withMessage("La descripción del gasto no puede estar vacia")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage(
      "La descripción del gasto solo puede contener letras y números"
    )
    .isLength({ max: 100 })
    .withMessage(
      "La descripción del gasto no puede tener más de 100 caracteres"
    )
    .run(req);

  // Si no hay errores, continuar con el siguiente middleware
  next();
};

export const validateExpenseId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await param("expenseId")
    .isInt()
    .withMessage("ID debe ser un número entero")
    .custom((value) => value > 0)
    .withMessage("ID debe ser mayor a 0")
    .run(req);

  let errors = validationResult(req);

  // Si hay errores, responder con un estado 400 y los errores
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // Si no hay errores, continuar con el siguiente middleware
  next();
};

export const validateExpenseExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      res.status(404).json({ message: "Gasto no encontrado" });
      return;
    }

    req.expense = expense;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
