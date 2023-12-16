import { cartModel } from "../models/carts.model.js";
import { productModel } from "../models/products.model.js";
import { ticketsModel } from "../models/ticket.model.js";
import { usersModel } from "../models/users.model.js";

import Manager from "./manager.js";

class CartManager extends Manager {
  constructor() {
    super(cartModel, "products.product");
  }
  async createCart(obj) {
    const createdCart = await cartModel.create(obj);
    return createdCart;
  }
  async findCartById(id) {
    const cart = await cartModel.findById(id).populate("products").lean();

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

    if (!cart) {
      return console.log("Cart not found");
    }

    let productIndex = cart.products.findIndex((product) =>
      product.product.equals(pid)
    );

    if (productIndex === -1) {
      cart.products.push({
        product: pid,
        quantity: 1,
      });
    } else {
      cart.products[productIndex].quantity++;
    }

    const productInfo = await productModel.findById(pid);
    if (
      productInfo &&
      cart.products[productIndex] &&
      cart.products[productIndex].quantity > productInfo.stock
    ) {
      return console.log("Not enough stock available");
    }

    await cart.save();

    console.log("Product added to cart successfully");
  }

  async purchaseCartById(cid, id) {
    let cart = await cartModel.findById(cid);
    console.log(cart);

    if (!cart) {
      return console.log("Cart not found");
    }

    if (cart.products.length === 0) {
      return { status: "error", message: "El carrito está vacío" };
    }
    const purchaser = await usersModel.findOne({ cart: cid }).select("email");

    if (!purchaser) {
      return console.log("Usuario no encontrado para el carrito");
    }

    const userEmail = purchaser.email;
    if (purchaser.cart == cart) {
      return console.log("cart asociado a user", purchaser);
    }
    const ticketProducts = [];

    let totalAmountSold = 0;

    for (const productInCart of cart.products) {
      console.log("Product Info in Cart:", productInCart);
      const productoInfo = await productModel
        .findById(productInCart.product)
        .lean();
      console.log("Full Product Info:", productoInfo);
      if (!productoInfo) {
        console.log(
          `Insufficient stock for product with ID ${productInCart.product}`
        );
      }

      if (productInCart.quantity <= productoInfo.stock) {
        ticketProducts.push({
          product: productInCart.product,
          quantity: productInCart.quantity,
          productInfo: {
            title: productoInfo.title,
            description: productoInfo.description,
            price: productoInfo.price,
          },
        });
        totalAmountSold += productInCart.quantity * productoInfo.price;
        console.log(`Monto total: ${totalAmountSold}`);

        await productModel.updateOne(
          { _id: productInCart.product },
          { $inc: { stock: -productInCart.quantity } }
        );
      } else {
        console.log(
          `Insufficient stock for product with ID ${productInCart.product}`
        );
      }
    }
    cart.products = [];
    await cartModel.updateOne({ _id: cid }, { products: [] });
    function generateUniqueCode() {
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(2, 8);
      const uniqueCode = `${timestamp}-${random}`;
      return uniqueCode;
    }

    const newTicket = {
      code: generateUniqueCode(),
      purchase_datetime: new Date(),
      amount: totalAmountSold,
      purchaser: userEmail,
    };
    const generateTicket = ticketsModel.create(newTicket);
    cart.products = [];
    await cart.save();
    return {
      generateTicket,
      status: "success",
      message: "Compra realizada",
      amount: totalAmountSold,
      //
      purchaser: userEmail,
      //
      ticketProducts,
    };
  }
}

export const cartManager = new CartManager();
