import Router from "express";

import { cartManager } from "../Dao/MongoDB/cart.js";
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
/*
router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartManager.updateProductFromCart(cid, pid);

    res.status(200).json({ message: "Product edited", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
*/
export default router;
