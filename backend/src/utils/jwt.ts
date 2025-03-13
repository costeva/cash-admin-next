import jwt from "jsonwebtoken";

export const generateJwt = (id: string): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  return token;
};
