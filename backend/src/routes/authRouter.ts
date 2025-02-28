import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/authController";

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
export default router;
