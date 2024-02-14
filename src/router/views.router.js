import { Router } from "express";
import {
  index,
  realTimeProducts,
  current,
  chat,
  getCartView,
  loginRender,
  signUpRender,
  resetPasswordRender,
  regeneratePasswordEmailRender,
  upload,
  upgradePremium,
  userAdministrationRender,
  administrateUserById,
  administrateUserRoleById,
  deleteUserAccount,
} from "../controllers/views.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roles } from "../utils/constants.js";

const router = Router();

router.get("/", index);

router.get("/realtimeproducts", realTimeProducts);

router.get("/current", current);

router.get("/chat", chat);

router.get(
  "/carts/:cid",
  authMiddleware([roles.ADMIN, roles.USER, roles.PREMIUM]),
  getCartView
);

router.get("/login", loginRender);

router.get("/signup", signUpRender);

router.get("/reset-password/:token", resetPasswordRender);

router.get("/regenerate-password-reset/:token", regeneratePasswordEmailRender);

router.get("/upload", upload);

router.get("/upgrade", upgradePremium);

// Ruta para la página de administración de usuarios
router.get("/admin/user", userAdministrationRender);

// Ruta para mostrar la información del usuario en formato JSON
router.get("/admin/user/:id", administrateUserById);

// Ruta para modificar el rol del usuario
router.post("/admin/user/:id/modify-role", administrateUserRoleById);

// Ruta para eliminar al usuario
router.post("/admin/user/:id/delete", deleteUserAccount);

export default router;
