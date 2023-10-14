import { productModel } from "../models/products.model.js";
import Manager from "./manager.js";
class ProductManager extends Manager {
  constructor() {
    super(productModel);
  }
}

export const productManager = new ProductManager();
