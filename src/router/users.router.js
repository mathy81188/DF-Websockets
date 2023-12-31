import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roles } from "../utils/constants.js";
import {
  getUserById,
  logOut,
  login,
  regeneratePasswordReset,
  requestPasswordRecovery,
  resetPasswordPage,
  resetPassword,
  togglePremiumStatus,
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
router.put(
  "/premium/:uid",
  // authMiddleware([roles.ADMIN]),
  togglePremiumStatus
);

export default router;
