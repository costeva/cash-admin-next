// Generar token

import User from "../models/Users";
export const generateToken = (user: User) =>
  Math.floor(100000 + Math.random() * 900000).toString();
