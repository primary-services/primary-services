import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import officeController from "../controllers/office.controller.js";

const officeRoutes = Router();

officeRoutes.get("/offices/:municipality_name", officeController.list);
officeRoutes.post("/office", auth, officeController.save);
officeRoutes.delete("/office/:id", auth, officeController.delete);

export { officeRoutes };
