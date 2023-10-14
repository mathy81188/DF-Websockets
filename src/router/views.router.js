import { Router } from "express";
import { productManager } from "../Dao/MongoDB/product.js";

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

export default router;
