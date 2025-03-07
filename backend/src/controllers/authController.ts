import type { Request, Response } from "express";
import User from "../models/Users";
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  static creatAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }
    try {
      const user = new User(req.body);
      user.password = await hashPassword(password);
      user.token = generateToken();

      await user.save();
      console.log("User created");
      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });
      console.log("Email sent");
      res.status(201).json({ message: "Cuenta creada", user });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;
    const user = await User.findOne({ where: { token } });
    if (!user) {
      res.status(400).json({ message: "Token inválido" });
      return;
    }
    user.confirmed = true;
    user.token = null;
    await user.save();
    res.status(200).json({ message: "Cuenta confirmada" });
    return;
  };
}
