import Router from "express";

import {
  deleteCart,
  deleteProductByIdFromCart,
  findCart,
  newCart,
  purchaseCart,
  updateCart,
  updateProductByIdFromCartById,
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roles } from "../constants.js";

const router = Router();

router.post("/", authMiddleware([roles.USER]), newCart);

router.get("/:cid", findCart);

router.delete("/:cid", deleteCart);

router.delete(
  "/:cid/product/:pid",
  authMiddleware([roles.USER]),
  deleteProductByIdFromCart
);

router.put("/:cid", authMiddleware([roles.USER]), updateCart);

router.put(
  "/:cid/product/:pid",
  authMiddleware([roles.USER]),
  updateProductByIdFromCartById
);

router.get("/:cid/purchase", purchaseCart);

export default router;
