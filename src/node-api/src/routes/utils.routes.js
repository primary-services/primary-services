import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import utilsController from "../controllers/utils.controller.js";

const utilsRoutes = Router();

utilsRoutes.get(
	"/utils/fetch_markdown/:file_name",
	utilsController.fetch_markdown,
);

export { utilsRoutes };
