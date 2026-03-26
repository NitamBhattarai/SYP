import express from "express";
import { listPandits, getPanditById, listServices, listPanditAvailability } from "../controllers/lookupController.js";

const router = express.Router();

router.get("/pandits", listPandits);
router.get("/pandits/:id", getPanditById);          // NEW: single pandit public profile
router.get("/services", listServices);
router.get("/availability/pandit/:id", listPanditAvailability);

export default router;