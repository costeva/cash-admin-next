import { RegisterForm } from "@/components/auth/RegisterForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CashAdmin - Crear cuenta",
  description: "Crea una cuenta para acceder a la aplicación",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-green-950">Crear una cuenta</h1>
      <p className="mt-3">Llena los siguientes campos para crear una cuenta</p>

      <RegisterForm />

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          href="/auth/login"
          className="block text-center my-5 text-gray-500"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>

        <Link
          href="/auth/forgot-password"
          className="block text-center my-5 text-gray-500"
        >
          ¿Olvidaste tu contraseña? Restablecer
        </Link>
      </nav>
    </>
  );
}
