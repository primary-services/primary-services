import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import electionController from "../controllers/election.controller.js";

const electionRoutes = Router();

electionRoutes.post("/election", auth, electionController.save);

export { electionRoutes };
