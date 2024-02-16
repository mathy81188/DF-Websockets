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
  administrateUserRoleById,
  deleteUserAccount,
  checkAdminRoleByEmail,
} from "../controllers/views.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roles } from "../utils/constants.js";

const router = Router();

router.get("/", index);

router.get("/realtimeproducts", realTimeProducts);

router.get("/current", current);

router.get("/chat", chat);

router.get("/carts/:cid", getCartView);

router.get("/login", loginRender);

router.get("/signup", signUpRender);

router.get("/reset-password/:token", resetPasswordRender);

router.get("/regenerate-password-reset/:token", regeneratePasswordEmailRender);

//carga de imagenes
router.get("/upload", upload);

router.get("/upgrade", upgradePremium);

// Ruta para la página de administración de usuarios
router.get(
  "/admin/user",
  authMiddleware([roles.ADMIN]),
  userAdministrationRender
);

// Ruta para mostrar la información del usuario en formato JSON
router.get("/admin/user/:email", checkAdminRoleByEmail);

// Ruta para modificar el rol del usuario
router.post("/admin/user/:id/modify-role", administrateUserRoleById);

// Ruta para eliminar al usuario
router.post("/admin/user/:id/delete", deleteUserAccount);

export default router;
