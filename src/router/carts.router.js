import Router from "express";
import {
  deleteCart,
  deleteProductByIdFromCart,
  findCart,
  newCart,
  updateCart,
  updateProductByIdFromCartById,
  purchaseCart,
  getAllCarts,
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roles } from "../utils/constants.js";

const router = Router();

router.get("/", getAllCarts);

router.post("/", authMiddleware([roles.USER]), newCart);

router.get("/:cid", findCart);

router.delete("/:cid", deleteCart);

router.delete(
  "/:cid/product/:pid",
  authMiddleware([roles.USER, roles.PREMIUM]),
  deleteProductByIdFromCart
);

router.put("/:cid", authMiddleware([roles.USER]), updateCart);

router.put(
  "/:cid/product/:pid",
  authMiddleware([roles.USER, roles.PREMIUM]),
  updateProductByIdFromCartById
);

router.get(
  "/:cid/purchase",
  authMiddleware([roles.USER, roles.PREMIUM]),
  purchaseCart
);

export default router;
