import { Router } from "express";
import { body, param } from "express-validator";
import { budgetController } from "../controllers/budgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetID } from "../middleware/budget";
const router = Router();
// se crean las rutas para la API
router.get("/", budgetController.getAll);

router.post(
  "/",
  body("name").notEmpty().withMessage("El name no puede estar vacío"),
  body("amount")
    .notEmpty()
    .withMessage("El aumount no puede estar vacío")
    .isNumeric()
    .withMessage("El amount debe ser un número")
    .custom((value) => value > 0)
    .withMessage("El amount debe ser mayor a 0"),
  handleInputErrors,
  budgetController.create
);

router.get("/:id", validateBudgetID, budgetController.getOne);

router.put(
  "/:id",
  param("id")
    .isInt()
    .withMessage("ID debe ser un número entero")
    .custom((value) => value > 0)
    .withMessage("ID debe ser mayor a 0"),
  body("name").notEmpty().withMessage("El name no puede estar vacío"),
  body("amount").notEmpty().withMessage("El amount no puede estar vacío"),
  body("amount").isNumeric().withMessage("El amount debe ser un número"),
  body("amount")
    .custom((value) => value > 0)
    .withMessage("El amount debe ser mayor a 0"),

  handleInputErrors,
  budgetController.update
);

router.delete(
  "/:id",
  param("id")
    .isInt()
    .withMessage("ID debe ser un número entero")
    .custom((value) => value > 0)
    .withMessage("ID debe ser mayor a 0"),

  budgetController.delete
);

export default router;
