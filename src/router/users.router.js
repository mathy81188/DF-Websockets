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
  getAllUsers,
  uploadImages,
} from "../controllers/users.controller.js";
import { upload } from "../utils/multer.js";
import { uploadPremium } from "../utils/premiumMulter.js";

const router = Router();

router.get("/", getAllUsers);

router.post("/login", login);

router.post("/signup", signUp);

router.get("/logout", logOut);

router.post("/password-recovery", resetPassword);
router.get("/reset-password/:token", resetPasswordPage);
router.post("/reset-password/:token", requestPasswordRecovery);

router.get("/regenerate-password-reset/:token", regeneratePasswordReset);
router.get("/:id", getUserById);

router.post(
  "/premium/:uid",
  uploadPremium.fields([
    { name: "identificacion", maxCount: 1 },
    { name: "domicilio", maxCount: 1 },
    { name: "estadoDeCuenta", maxCount: 1 },
  ]),
  togglePremiumStatus
);
router.post("/:uid/documents", upload.array("documents"), uploadImages);

export default router;
