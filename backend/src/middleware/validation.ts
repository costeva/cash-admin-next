import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Middleware function to handle input validation errors.
 *
 * This function checks for validation errors in the request object.
 * If any validation errors are found, it responds with a 400 status code
 * and a JSON object containing the errors. If no errors are found, it
 * passes control to the next middleware function.
 *
 * @param req - The request object from the client.
 * @param res - The response object to send data back to the client.
 * @param next - The next middleware function in the stack.
 *
 * @returns void
 */
export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
