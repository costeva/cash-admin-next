import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgotPassword";
import Link from "next/link";
export const metadata: Metadata = {
  title: "CashAdmin - Olvidaste tu contraseña",
  description: "Recupera tu contraseña",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-green-950">
        Recupera tu Constraseña
      </h1>
      <p className="mt-3">
        Llena los siguientes campos para para recuperar tu contraseña
      </p>

      <ForgotPasswordForm />

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          href="/auth/login"
          className="block text-center my-5 text-gray-500"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>

        <Link
          href="/auth/register"
          className="block text-center my-5 text-gray-500"
        >
          ¿No tienes una cuenta? Crea una cuenta
        </Link>
      </nav>
    </>
  );
}
