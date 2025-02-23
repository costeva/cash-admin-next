import { Router } from "express";
import { body, param } from "express-validator";
import { budgetController } from "../controllers/budgetController";
import { handleInputErrors } from "../middleware/validation";
import {
  validateBudgetExists,
  validateBudgetID,
  validateBudgetInput,
} from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseInput } from "../middleware/expense";
const router = Router();
// se crean los middleware para validar los parámetros de la API, estas dos lineas permite que las rutas que tengan el parametro budgetId, sean validadas por los middleware validateBudgetID y validateBudgetExists
router.param("budgetId", validateBudgetID);
router.param("budgetId", validateBudgetExists);

// se crean las rutas para la API
router.get("/", budgetController.getAll);

router.post(
  "/",
  validateBudgetInput,
  handleInputErrors,
  budgetController.create
);

router.get("/:budgetId", budgetController.getOne);

router.put(
  "/:budgetId",
  validateBudgetInput,
  handleInputErrors,
  budgetController.update
);

router.delete("/:budgetId", budgetController.delete);

/** Routes for expenses */

router.get("/:budgetId/expenses", ExpensesController.getAll);

router.post(
  "/:budgetId/expenses",
  validateExpenseInput,
  handleInputErrors,

  ExpensesController.create
);

router.get("/:budgetId/expenses/:expenseId", ExpensesController.getOne);

router.put("/:budgetId/expenses/:expenseId", ExpensesController.update);

router.delete("/:budgetId/expenses/:expenseId", ExpensesController.delete);

export default router;
