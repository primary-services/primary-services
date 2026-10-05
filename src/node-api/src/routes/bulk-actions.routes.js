import { Router } from "express";
import multer from "multer";
import { auth } from "../middlewares/auth.middleware.js";
import contactController from "../controllers/contact.controller.js";
import bulkActionsController from "../controllers/bulk-actions.controller.js";

 const upload = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: 5 * 1024 * 1024 },
 });
 
const bulkActionsRoutes = Router();

bulkActionsRoutes.post(
  "/bulk-actions/contacts-upload",
  auth,
  upload.single("file"),
  contactController.upload,
);
bulkActionsRoutes.get("/bulk-actions/contacts-download", auth, contactController.download);
bulkActionsRoutes.get("/bulk-actions/download-mail-merge", auth, bulkActionsController.downloadMailMerge);

export { bulkActionsRoutes };
