import { Router } from "express";
import { generateMockingproducts } from "../utils/faker.js";
import {
  getAllProducts,
  findByProductId,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roles } from "../utils/constants.js";

const router = Router();

router.get("/", getAllProducts);

router.get("/:pid", findByProductId);

router.post("/", authMiddleware([roles.ADMIN]), createProduct);

router.delete("/:pid", deleteProduct);

router.put("/:pid", updateProduct);

export default router;
