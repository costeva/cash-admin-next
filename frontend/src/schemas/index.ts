import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Email no válido").min(1, "Email requerido"),
    name: z.string().min(1, "Nombre requerido"),
    password: z.string().min(8, "Password mínimo de 8 caracteres"),
    password_confirmation: z.string().min(8, "Password mínimo de 8 caracteres"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });
