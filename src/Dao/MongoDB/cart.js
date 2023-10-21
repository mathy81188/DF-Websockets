import { cartModel } from "../models/carts.model.js";
import Manager from "./manager.js";
class CartManager extends Manager {
  constructor() {
    super(cartModel);
  }
  async createCart(obj) {
    const createdCart = await cartModel.create(obj);
    return createdCart;
  }
  async findCartById(id) {
    const cart = await cartModel.findById(id).populate("products");
    return cart;
  }

  async deleteProductToCart(cid, pid) {
    const cart = await cartModel.findById(cid);
    console.log(cart);

    if (!cart) {
      console.log("Cart not found");
      return;
    }

    let productIndex = cart.products.findIndex((product) => product.id == +pid);
    console.log(productIndex);

    if (productIndex === -1) {
      cart.products.splice(productIndex);
    } else {
      console.log("Product not found in the cart");
      return;
    }

    await cart.save();
  }
  async updateProductFromCart(cid, pid) {
    let cart = await cartModel.findById(cid);
    console.log(cart);

    let productIndex = cart.products.findIndex(
      (product) => product.productId === pid
    );
    if (productIndex === -1) {
      cart.products.push({
        product: pid,
        quantity: 1,
      });
    } else {
      cart.products[productIndex].quantity += 1;
    }

    await cart.save();
  }
}

export const cartManager = new CartManager();
