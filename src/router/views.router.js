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
} from "../controllers/views.controller.js";

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

router.get("/upload", upload);

export default router;
