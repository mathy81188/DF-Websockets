import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const product = await ProductManager.getProducts(req.query);
    if (!product.length) {
      return res.status(200).json({ message: "No products" });
    }
    res.status(200).json({ message: "Products found", product });
    req.product = product;
    res.redirect(`/api/products/${product}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await ProductManager.getProductById(+pid);
    if (!product) {
      res.status(400).json({ message: "Product not found with the id" });
    }
    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;
  if (!title || !description || !price || !thumbnail || !code || !stock) {
    return res.status(400).json({ message: "Some data is missing" });
  }
  try {
    const newProd = await ProductManager.addProduct(req.body);
    res.status(200).json({ message: "Product created", prod: newProd });
    req.prod = newProd;
    res.redirect(`/product/${newProd.id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  console.log(pid);
  try {
    const response = await ProductManager.deleteProduct(+pid);
    if (response === -1) {
      res.status(400).json({ message: "Product not found with the id" });
    } else {
      res.status(200).json({ message: "Product deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const response = await ProductManager.updateProduct(+pid, req.body);
    if (response === -1) {
      res.status(400).json({ message: "Product not found with the id" });
    } else {
      res.status(200).json({ message: "Poduct updated" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
