import { productModel } from "../models/products.model.js";
import Manager from "./manager.js";

class ProductManager extends Manager {
  constructor() {
    super(productModel);
  }
  async getAll(option) {
    const products = await productModel.paginate({}, option);
    const info = {
      pages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.pages,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,

      prevLink: products.hasPrevPage
        ? `http://localhost:8080/api/products?page=${products.prevPage}`
        : null,
      nextLink: products.hasNextPage
        ? `http://localhost:8080/api/products?page=${products.nextPage}`
        : null,
    };

    return { info, result: products.docs };
  }
}

export const productManager = new ProductManager();
