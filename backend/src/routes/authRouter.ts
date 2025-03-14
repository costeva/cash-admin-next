import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/authController";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";
import { authentificate } from "../middleware/auth";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("nombre es requerido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("´Password debe tener al menos 8 caracteres"),
  body("email").isEmail().withMessage("Email es requerido"),

  AuthController.creatAccount
);

router.post(
  "/confirm-account",
  limiter,
  body("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("El token es requerido"),
  handleInputErrors,

  AuthController.confirmAccount
);

router.post(
  "/login",
  limiter,
  body("email").isEmail().withMessage("Email es requerido"),
  body("password").notEmpty().withMessage("Password es requerido"),
  handleInputErrors,

  AuthController.login
);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email es requerido"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("El token es requerido"),
  handleInputErrors,
  AuthController.validateToken
);

router.post(
  "/reset-password/:token",
  param("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("El token no es valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password debe tener al menos 8 caracteres"),
  handleInputErrors,
  AuthController.resetPasswordWithToken
);

router.get("/user", authentificate, AuthController.user);

router.post(
  "/update-password",
  authentificate,
  body("current-password")
    .notEmpty()
    .withMessage("Password actual es requerido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password debe tener al menos 8 caracteres"),
  handleInputErrors,
  AuthController.updatePassword
);

router.post(
  "/check-password",
  authentificate,
  body("password").notEmpty().withMessage("Password actual es requerido"),

  handleInputErrors,
  AuthController.checkPassword
);
export default router;
