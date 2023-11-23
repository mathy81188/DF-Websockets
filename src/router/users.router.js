import { Router } from "express";
import {
  getUserById,
  logOut,
  login,
  signUp,
} from "../controllers/users.controller.js";

const router = Router();

router.post("/login", login);

router.post("/signup", signUp);

router.get("/logout", logOut);

router.get("/:id", getUserById);

export default router;
