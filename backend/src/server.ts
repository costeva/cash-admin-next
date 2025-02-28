import express from "express";
import colors from "colors";
import morgan from "morgan";
import { db } from "./config/db";
import bugetRouter from "./routes/budgetRouter";
import authRouter from "./routes/authRouter";

async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.green("Conexión a la base de datos establecida"));
  } catch (error) {
    console.error(colors.red("Error al conectar a la base de datos: "), error);
  }
}
connectDB();

// se crea la aplicación express
const app = express();

app.use(morgan("dev"));

app.use(express.json());
// se crea la ruta para la API
app.use("/api/v1/budgets", bugetRouter);

app.use("/api/v1/auth", authRouter);

export default app;
