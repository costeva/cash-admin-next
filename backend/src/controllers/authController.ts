import type { Request, Response } from "express";
import User from "../models/Users";
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";

export class AuthController {
  static creatAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }
    try {
      console.log(req.body);

      const user = new User(req.body);
      user.password = await hashPassword(password);
      user.token = generateToken();

      await user.save();
      res.status(201).json({ message: "Cuenta creada", user });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
}
