import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
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
municipalityRoutes.get(
	"/municipalities/:municipality_id/collections",
	municipalityController.collections,
);
municipalityRoutes.post(
	"/municipalities/:municipality_id/note",
	municipalityController.createNote,
);
municipalityRoutes.delete(
	"/municipalities/:municipality_id/note/:note_id",
	municipalityController.deleteNote,
);
municipalityRoutes.post(
	"/municipalities/:municipality_id/source/",
	municipalityController.createSource,
);
municipalityRoutes.delete(
	"/municipalities/:municipality_id/source/:source_id",
	municipalityController.deleteSource,
);

municipalityRoutes.post("/municipalities/:municipality_id/source");
municipalityRoutes.delete("/municipalities/:municipality_id/source/:source_id");

export { municipalityRoutes };
