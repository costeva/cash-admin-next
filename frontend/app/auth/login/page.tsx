import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
export const metadata: Metadata = {
  title: "CashAdmin - Iniciar sesión",
  description: "inicia sesión para acceder a la aplicación",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-green-950">Iniciar Sesión</h1>
      <p className="mt-3">Llena los siguientes campos para iniciar sesión</p>

      <LoginForm />

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          href="/auth/register"
          className="block text-center my-5 text-gray-500"
        >
          ¿No tienes una cuenta? Crea una cuenta
        </Link>

        <Link
          href="/auth/forget-password"
          className="block text-center my-5 text-gray-500"
        >
          ¿Olvidaste tu contraseña? Restablecer
        </Link>
      </nav>
    </>
  );
}
