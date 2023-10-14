import { cartModel } from "../models/carts.model.js";
import Manager from "./manager.js";
class CartManager extends Manager {
  constructor() {
    super(cartModel);
  }
}

export const cartManager = new CartManager();
