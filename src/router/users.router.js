import { Router } from "express";
import {
  getUserById,
  logOut,
  login,
  regeneratePasswordReset,
  requestPasswordRecovery,
  resetPasswordPage,
  resetPassword,
  signUp,
} from "../controllers/users.controller.js";

const router = Router();

router.post("/login", login);

router.post("/signup", signUp);

router.get("/logout", logOut);

router.post("/password-recovery", resetPassword);
router.get("/reset-password/:token", resetPasswordPage);
router.post("/reset-password/:token", requestPasswordRecovery);

router.get("/regenerate-password-reset/:token", regeneratePasswordReset);

router.get("/:id", getUserById);
export default router;
