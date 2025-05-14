import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import municipalityController from "../controllers/municipality.controller.js";

const municipalityRoutes = Router();

municipalityRoutes.get("/municipalities/towns", municipalityController.list);
municipalityRoutes.get(
	"/municipalities/:municipality_id/offices",
	municipalityController.offices,
);
municipalityRoutes.get(
	"/municipalities/:municipality_id/elections",
	municipalityController.elections,
);

export { municipalityRoutes };
