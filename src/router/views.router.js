import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await ProductManager.getProducts({});
  res.render("index", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await ProductManager.getProducts({});
  res.render("realTimeProducts", { products });
});

export default router;
