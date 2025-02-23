import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";

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
