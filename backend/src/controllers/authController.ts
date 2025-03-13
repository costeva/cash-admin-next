import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/Users";
import { comparePassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJwt } from "../utils/jwt";

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
    user.token = "";
    await user.save();
    res.status(200).json({ message: "Cuenta confirmada" });
    return;
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    //revisar que el usuario exista
    const userExists = await User.findOne({ where: { email } });
    console.log(userExists, "userExists");
    if (!userExists) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ message: error.message });
      return;
    }
    if (!userExists.confirmed) {
      const error = new Error("La cuenta no ha sido confirmada");
      res.status(403).json({ message: error.message });
      return;
    }

    const isPasswordCorrect = await comparePassword(
      password,
      userExists.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("Password incorrecto");
      res.status(401).json({ message: error.message });
      return;
    }

    //generar token
    const token = generateJwt(userExists.id);
    res.json(token);
  };

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    //revisar que el usuario exista
    const userExists = await User.findOne({ where: { email } });

    if (!userExists) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ message: error.message });
      return;
    }
    userExists.token = generateToken();
    await userExists.save();

    AuthEmail.passwordReset({
      name: userExists.name,
      email: userExists.email,
      token: userExists.token,
    });
    res.json("Email enviado");
  };

  static validateToken = async (req: Request, res: Response) => {
    const { token } = req.body;

    const tokenExists = await User.findOne({ where: { token } });
    if (!tokenExists) {
      res.status(404).json({ message: "Token no válido" });
      return;
    }
    res.status(200).json({ message: "Token válido" });
    return;
  };

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ where: { token } });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ message: error.message });
      return;
    }

    user.password = await hashPassword(password);
    user.token = null;
    user.save();

    res.json("El password ya se registro");
  };

  static user = async (req: Request, res: Response) => {
    res.json(req.user);
  };
}
