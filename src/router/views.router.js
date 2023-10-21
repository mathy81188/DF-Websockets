import { Router } from "express";
import { productManager } from "../Dao/MongoDB/product.js";
import { cartManager } from "../Dao/MongoDB/cart.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.find({});
  res.render("index", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.find({});
  res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.findCartById(cid);
  res.render("cart", { cart });
});

export default router;
