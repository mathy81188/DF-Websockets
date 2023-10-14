import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const info = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(info);
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      let id;
      let products;
      if (!carts.length) {
        id = 1;
        products = [];
      } else {
        id = carts[carts.length - 1].id + 1;
        products = [];
      }
      const newCart = { id, products };
      carts.push(newCart);
      // carts.push({ id, ...products });

      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return newCart;
    } catch (error) {
      return error;
    }
  }
  async getCartById(cid) {
    try {
      const carts = await this.getCarts({});
      console.log("prods", carts);
      const cart = carts.find((c) => c.id === cid);
      return cart;
    } catch (error) {
      return error;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts({});
      let cart = await this.getCartById(+cid);
      console.log(cart);

      let productIndex = cart.products.findIndex(
        (product) => product.product === +pid
      );
      if (productIndex === -1) {
        cart.products.push({
          product: +pid,
          quantity: 1,
        });
      } else {
        cart.products[productIndex].quantity += 1;
      }

      const cartIndex = carts.findIndex((cart) => cart.id === +cid);
      carts[cartIndex] = cart;

      await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      return error;
    }
  }
}

export default new CartManager("cart.json");
