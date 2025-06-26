import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/signup", authController.signup);
// authRoutes.post("/login", authController.login);
// authRoutes.post("/logout", authController.logout);
// authRoutes.post("/request-password-reset", authController.requestPasswordReset);
// authRoutes.post("/reset-password", authController.resetPassword);

export { authRoutes };
