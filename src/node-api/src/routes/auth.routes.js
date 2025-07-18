import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";

import authController from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/authorize", auth, authController.authorize);
authRoutes.post("/signup", authController.signup);
authRoutes.post("/login", authController.login);
// authRoutes.post("/request-password-reset", authController.requestPasswordReset);
// authRoutes.post("/reset-password", authController.resetPassword);

export { authRoutes };
