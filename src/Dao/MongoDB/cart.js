import { logger } from "../../utils/winston.js";
import { cartModel } from "../../models/carts.model.js";
import { productModel } from "../../models/products.model.js";
import { ticketsModel } from "../../models/ticket.model.js";
import { usersModel } from "../../models/users.model.js";

import Manager from "./manager.js";

class CartManager extends Manager {
  constructor() {
    super(cartModel, "products.product");
  }

  async getAllCarts(obj) {
    const cart = await cartModel.find(obj).populate("products.product").lean();

    return cart;
  }
  async createCart(obj) {
    const createdCart = await cartModel.create(obj);
    return createdCart;
  }
  async findCartById(id) {
    const cart = await cartModel
      .findById(id)
      .populate("products.product")
      .lean();

    return cart;
  }

  async deleteProductToCart(cid, pid) {
    const cart = await cartModel.findById(cid);
    logger.info(cart);

    if (!cart) {
      logger.error("Cart not found");
      return;
    }

    let productIndex = cart.products.findIndex((product) => product.id == +pid);
    logger.info(productIndex);

    if (productIndex === -1) {
      cart.products.splice(productIndex);
    } else {
      logger.error("Product not found in the cart");
      return;
    }

    await cart.save();
  }

  async updateProductFromCart(cid, pid) {
    try {
      let cart = await cartModel.findById(cid);
      console.log("cart", cart);

      if (!cart) {
        return logger.error("Cart not found");
      }

      let productIndex = cart.products.findIndex((product) =>
        product.product.equals(pid)
      );

      const productInfo = await productModel.findById(pid);
      console.log("productInfo before", productInfo);

      // Chequear productInfo si existe y si tiene stock
      if (!productInfo || productInfo.stock <= 0) {
        return console.log("Product not found or out of stock");
      }

      // controlar si el poducto xiste en el carrito
      if (productIndex === -1) {
        // agregar producto al carrito
        cart.products.push({
          product: pid,
          quantity: 1,
        });
      } else {
        // Incrementa the quantity en cart
        cart.products[productIndex].quantity++;
      }

      // Update product stock
      productInfo.stock--;

      // Actualizar stock del producto en la base de datos
      await productInfo.save();

      console.log("productInfo after", productInfo);

      // Actualizar el carrito en la base de datos
      await cart.save();

      console.log("Product added to cart successfully");
    } catch (error) {
      console.error("Error updating product and cart:", error);
      // Handle the error appropriately
    }
  }

  async purchaseCartById(cid, id) {
    let cart = await cartModel.findById(cid);
    logger.info(cart);

    if (!cart) {
      return logger.error("Cart not found");
    }

    if (cart.products.length === 0) {
      return { status: "error", message: "El carrito está vacío" };
    }
    const purchaser = await usersModel.findOne({ cart: cid }).select("email");

    if (!purchaser) {
      return logger.error("Usuario no encontrado para el carrito");
    }

    const userEmail = purchaser.email;
    if (purchaser.cart == cart) {
      return logger.info("cart asociado a user", purchaser);
    }
    const ticketProducts = [];

    let totalAmountSold = 0;

    for (const productInCart of cart.products) {
      logger.info("Product Info in Cart:", productInCart);
      const productoInfo = await productModel
        .findById(productInCart.product)
        .lean();
      logger.info("Full Product Info:", productoInfo);
      if (!productoInfo) {
        logger.error(
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
        logger.info(`Monto total: ${totalAmountSold}`);

        await productModel.updateOne(
          { _id: productInCart.product },
          { $inc: { stock: -productInCart.quantity } }
        );
      } else {
        logger.error(
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
