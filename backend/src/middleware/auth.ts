import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/Users";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authentificate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  const token = bearer.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "token no valido" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === "object" && decoded.id) {
      req.user = await User.findByPk(decoded.id, {
        attributes: ["id", "name", "email"],
      });

      next();
    }
  } catch {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
