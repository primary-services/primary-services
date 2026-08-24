import { Router } from "express";
import multer from "multer";
import { auth } from "../middlewares/auth.middleware.js";
import contactController from "../controllers/contact.controller.js";

const upload = multer({ storage: multer.memoryStorage() });

const contactRoutes = Router();

// contactRoutes.post("/contacts/create", auth, contactController.create);
contactRoutes.post(
  "/contacts/upload",
  auth,
  upload.single("file"),
  contactController.upload,
);
contactRoutes.post("/contacts/download", auth, contactController.download);

export { contactRoutes };
