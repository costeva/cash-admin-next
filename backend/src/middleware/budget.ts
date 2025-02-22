import { Request, Response, NextFunction } from "express";
import { validationResult, param, body } from "express-validator";
import Budget from "../models/Budget";

declare global {
  namespace Express {
    export interface Request {
      budget?: Budget;
    }
  }
}
// Middleware para validar el ID del presupuesto en las solicitudes
export const validateBudgetID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Validar que el parámetro "id" es un número entero y mayor a 0
  await param("budgetId")
    .isInt()
    .withMessage("ID debe ser un número entero")
    .custom((value) => value > 0)
    .withMessage("ID debe ser mayor a 0")
    .run(req);

  // Obtener los resultados de la validación
  let errors = validationResult(req);

  // Si hay errores, responder con un estado 400 y los errores
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // Si no hay errores, continuar con el siguiente middleware
  next();
};

export const validateBudgetExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
      res.status(404).json({ message: "Presupuesto no encontrado" });
      return;
    }

    req.budget = budget;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const validateBudgetInput = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await body("name")
    .notEmpty()
    .withMessage("El name no puede estar vacío")
    .run(req);
  await body("amount")
    .notEmpty()
    .withMessage("El aumount no puede estar vacío")
    .isNumeric()
    .withMessage("El amount debe ser un número")
    .custom((value) => value > 0)
    .withMessage("El amount debe ser mayor a 0")
    .run(req);

  // Si no hay errores, continuar con el siguiente middleware
  next();
};
