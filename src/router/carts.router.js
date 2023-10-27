import Router from "express";

import {
  deleteCart,
  deleteProductByIdFromCart,
  findCart,
  newCart,
  updateCart,
  updateProductByIdFromCartById,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", newCart);

router.get("/:cid", findCart);

router.delete("/:cid", deleteCart);

router.delete("/:cid/product/:pid", deleteProductByIdFromCart);

router.put("/:cid", updateCart);

router.put("/:cid/product/:pid", updateProductByIdFromCartById);

export default router;
