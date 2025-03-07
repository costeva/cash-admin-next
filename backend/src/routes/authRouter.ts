import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/authController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("Name is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters"),
  body("email").isEmail().withMessage("Email is required"),

  AuthController.creatAccount
);

router.post(
  "/confirm-account",
  body("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token is required"),
  handleInputErrors,

  AuthController.confirmAccount
);

export default router;
