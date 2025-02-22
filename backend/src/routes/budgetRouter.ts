import { Router } from "express";
import { body } from "express-validator";
import { budgetController } from "../controllers/budgetController";
const router = Router();
// se crean las rutas para la API
router.get("/", budgetController.getAll);

router.post(
  "/",
  body("name").notEmpty().withMessage("El nombre no puede estar vacío"),
  budgetController.create
);

router.get("/:id", budgetController.getOne);

router.put("/:id", budgetController.update);

router.delete("/:id", budgetController.delete);

export default router;
