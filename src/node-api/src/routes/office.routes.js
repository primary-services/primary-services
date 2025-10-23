import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import officeController from "../controllers/office.controller.js";

const officeRoutes = Router();

officeRoutes.get("/offices/:municipality_name", officeController.list);
officeRoutes.post("/office", officeController.save);

export { officeRoutes };
