import { Router } from "express";
import {
  getAllProducts,
  findByProductId,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getAllProducts);

router.get("/:pid", findByProductId);

router.post("/", createProduct);

router.delete("/:pid", deleteProduct);

router.put("/:pid", updateProduct);

export default router;
