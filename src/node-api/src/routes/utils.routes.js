import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import utilsController from "../controllers/utils.controller.js";

const utilsRoutes = Router();

utilsRoutes.get(
	"/utils/fetch_markdown/:file_name",
	utilsController.fetch_markdown,
);

utilsRoutes.post("/utils/toggle_flag", auth, utilsController.toggle_flag);

export { utilsRoutes };
