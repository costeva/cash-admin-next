// Generar token
export const generateToken = (user) =>
  Math.floor(100000 + Math.random() * 900000).toString();
