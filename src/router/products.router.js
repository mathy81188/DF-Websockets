import { Router } from "express";
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

router.post(
  "/",
  authMiddleware([roles.ADMIN, roles.USER, roles.PREMIUM]),
  createProduct
);

router.delete(
  "/:pid",
  authMiddleware([roles.ADMIN, roles.PREMIUM]),
  deleteProduct
);

router.put("/:pid", updateProduct);

export default router;
