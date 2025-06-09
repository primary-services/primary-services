import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import contactController from "../controllers/contact.controller.js";

const contactRoutes = Router();

contactRoutes.post("/contacts/create", contactController.create);

export { contactRoutes };
