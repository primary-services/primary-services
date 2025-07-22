import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import contactController from "../controllers/contact.controller.js";

const contactRoutes = Router();

contactRoutes.post("/contacts/create", contactController.create);

export { contactRoutes };
