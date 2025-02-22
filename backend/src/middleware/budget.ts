import { Request, Response, NextFunction } from "express";
import { validationResult, param } from "express-validator";

// Middleware para validar el ID del presupuesto en las solicitudes
export const validateBudgetID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Validar que el parámetro "id" es un número entero y mayor a 0
  await param("id")
    .isInt()
    .withMessage("ID debe ser un número entero")
    .custom((value) => value > 0)
    .withMessage("ID debe ser mayor a 0")
    .run(req);

  // Obtener los resultados de la validación
  const errors = validationResult(req);

  // Si hay errores, responder con un estado 400 y los errores
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // Si no hay errores, continuar con el siguiente middleware
  next();
};
