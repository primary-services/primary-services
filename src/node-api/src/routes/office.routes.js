import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import officeController from "../controllers/office.controller.js";

const officeRoutes = Router();

officeRoutes.post("/office", officeController.save);

export { officeRoutes };
