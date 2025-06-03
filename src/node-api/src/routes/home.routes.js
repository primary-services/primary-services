import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import homeController from "../controllers/home.controller.js";

const homeRoutes = Router();

homeRoutes.get("/welcome", homeController.welcome);

export { homeRoutes };
