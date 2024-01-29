import { Router } from "express";
import { createMessage } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roles } from "../constants.js";
const router = Router();

router.post("/", authMiddleware([roles.USER]), createMessage);

export default router;
