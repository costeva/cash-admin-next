import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //recuerda que son milisegundos (15 minutos)
  limit: process.env.NODE_ENV === "production" ? 5 : 100, //limita a 6 peticiones por ventana
  message: { erro: "Demasiadas peticiones, intenta de nuevo en 15 minutos" },
});
