import { cartManager } from "../src/Dao/MongoDB/cart.js";
import { productManager } from "../src/Dao/MongoDB/product.js";
import { expect } from "chai";

describe("CartManager", function () {
  describe("getAllCarts", function () {
    it("should return an array of carts", async function () {
      const result = await cartManager.getAllCarts();
      expect(result).to.be.an("array");
    });
  });

  describe("createCart", function () {
    it("should create a new cart", async function () {
      const result = await cartManager.createCart();
      expect(result).to.have.property("_id");
    });
  });

  describe("deleteProductToCart", function () {
    it("should delete a product from the cart", async function () {
      const newCart = await cartManager.createCart({});

      const newProduct = await productManager.create({});

      newCart.products.push({ product: newProduct._id, quantity: 1 });
      await newCart.save();

      await cartManager.deleteProductToCart(newCart._id, newProduct._id);

      const updatedCart = await cartManager.findCartById(newCart._id);
      expect(updatedCart.products).to.have.lengthOf(0);
    });
  });
});
