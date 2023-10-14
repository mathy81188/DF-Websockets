import Router from "express";

import { cartManager } from "../Dao/MongoDB/cart.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.create();
    res.status(200).json({ message: `Carrito creado con exito  `, newCart });
    return newCart;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.findById(+cid);
    if (!cart) {
      res.status(400).json({ message: "Cart not found with the id" });
      return;
    }
    res.status(200).json({ message: "Cart found", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartManager.create(+cid, +pid);

    res.status(200).json({ message: "Product added to the Cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
