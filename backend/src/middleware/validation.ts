/**
 * Función middleware para manejar errores de validación de entrada para solicitudes de Express.
 *
 * Esta función utiliza la función `validationResult` de la biblioteca `express-validator`
 * para verificar errores de validación en la solicitud. Si se encuentran errores, envía una respuesta
 * con un código de estado 400 y un objeto JSON que contiene los errores. Si no se encuentran errores,
 * llama a la función `next` para pasar el control al siguiente middleware o controlador de ruta.
 *
 * @param req - El objeto de solicitud de Express.
 * @param res - El objeto de respuesta de Express.
 * @param next - La siguiente función middleware en la pila.
 *
 * @returns Si se encuentran errores de validación, se devuelve una respuesta con un código de estado 400 y un objeto JSON que contiene los errores. De lo contrario, se llama a la función `next`.
 */

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
