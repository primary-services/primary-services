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
	"/municipalities/:municipality_id/wards",
	municipalityController.wards,
);
municipalityRoutes.get(
	"/municipalities/:municipality_id/elections",
	municipalityController.elections,
);
municipalityRoutes.get(
	"/municipalities/:municipality_id/collections",
	municipalityController.collections,
);
municipalityRoutes.get(
	"/municipalities/:municipality_id/history",
	municipalityController.history,
);
municipalityRoutes.post(
	"/municipalities/:municipality_id",
	auth,
	municipalityController.save,
);
municipalityRoutes.post(
	"/municipalities/:municipality_id/note",
	auth,
	municipalityController.createNote,
);
municipalityRoutes.delete(
	"/municipalities/:municipality_id/note/:note_id",
	auth,
	municipalityController.deleteNote,
);
municipalityRoutes.post(
	"/municipalities/:municipality_id/source/",
	auth,
	municipalityController.createSource,
);
municipalityRoutes.delete(
	"/municipalities/:municipality_id/source/:source_id",
	auth,
	municipalityController.deleteSource,
);
municipalityRoutes.post(
	"/municipalities/:municipality_id/ward/",
	auth,
	municipalityController.createWard,
);
municipalityRoutes.delete(
	"/municipalities/:municipality_id/ward/:ward_id",
	auth,
	municipalityController.deleteWard,
);
municipalityRoutes.get(
	"/municipalities/completion",
	municipalityController.completetion,
);

export { municipalityRoutes };
