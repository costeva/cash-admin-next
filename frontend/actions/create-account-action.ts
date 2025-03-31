"use server";

import { registerSchema } from "@/src/schemas";

export async function createAccountAction(formData: FormData) {
  "use server";
  const dataRegister = {
    email: formData.get("email")?.toString() || "",
    name: formData.get("name")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    password_confirmation:
      formData.get("password_confirmation")?.toString() || "",
  };
  // Validate the data
  const register = registerSchema.safeParse(dataRegister);

  const errors = register?.error?.errors.map((error) => error.message);

  if (!register.success) {
    return {};
  }

  const url = `${process.env.API_URL}/auth/create-account`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
    body: JSON.stringify(dataRegister),
  };

  const response = await fetch(url, options);
  const data = await response.json();

  console.log("Response from API:", data);
}
