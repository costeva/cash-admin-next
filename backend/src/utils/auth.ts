import bcrypt from "bcrypt";

// Hash password
export const hashPassword = async (password: string) => {
  // Generate a salt con 10 rounds
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
