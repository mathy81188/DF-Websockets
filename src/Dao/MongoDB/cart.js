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
    try {
      // Obtener la información completa del producto
      const product = await productModel.findById(pid);

      if (!product) {
        return logger.error("Product not found");
      }

      let cart = await cartModel.findById(cid);

      if (!cart) {
        return logger.error("Cart not found");
      }

      let productIndex = cart.products.findIndex(
        (product) => product.product == pid
      );

      if (productIndex === -1) {
        return logger.error("Product not found in the cart");
      }

      // Obtener el precio unitario del producto
      const productPrice = product.price;

      // Decrementar la cantidad del producto en el carrito
      cart.products[productIndex].quantity--;

      // Restar el precio unitario del producto por la cantidad eliminada al precio total del producto en el carrito
      cart.products[productIndex].totalPrice -= productPrice * 1; // Restar el precio unitario por la cantidad eliminada

      // Eliminar el producto del carrito si la cantidad es 0
      if (cart.products[productIndex].quantity === 0) {
        cart.products.splice(productIndex, 1);
      }
      // Actualizar el stock del producto en la base de datos
      product.stock++;
      await product.save(); // Guardar la actualización del stock

      // Guardar los cambios en el carrito
      await cart.save();

      const updatedCart = await cartModel.findById(cid);
      return updatedCart;
    } catch (error) {
      console.error("Error deleting product from cart:", error);
    }
  }

  async updateProductFromCart(cid, pid) {
    try {
      let cart = await cartModel.findById(cid);

      if (!cart) {
        return logger.error("Cart not found");
      }

      let productIndex = cart.products.findIndex((product) =>
        product.product.equals(pid)
      );

      const productInfo = await productModel.findById(pid);

      if (!productInfo || productInfo.stock <= 0) {
        return console.log("Product not found or out of stock");
      }

      if (productIndex === -1) {
        // Agregar el producto al carrito
        cart.products.push({
          product: pid,
          quantity: 1,
          totalPrice: productInfo.price, // Establecer el precio total inicial
        });
      } else {
        // Incrementar la cantidad en el carrito
        cart.products[productIndex].quantity++;
        // Actualizar el precio total del producto en función de la cantidad
        cart.products[productIndex].totalPrice += productInfo.price;
      }

      // Actualizar el stock del producto en la base de datos
      productInfo.stock--;

      await productInfo.save();

      // Guardar los cambios en el carrito
      await cart.save();

      console.log("Product added to cart successfully");
      return { message: "Product edited" };
    } catch (error) {
      console.error("Error updating product and cart:", error);
    }
  }

  async purchaseCartById(cid) {
    try {
      let cart = await cartModel.findById(cid);

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

      const ticketProducts = [];
      let totalAmountSold = 0;
      let productsWithInsufficientStock = [];

      for (const productInCart of cart.products) {
        const productInfo = await productModel
          .findById(productInCart.product)
          .lean();

        if (!productInfo) {
          logger.error(
            `Product with ID ${productInCart.product} not found in database`
          );
          continue; // Pasar al siguiente producto si no se encuentra la información
        }

        // Obtener el stock disponible en la base de datos, considerando las unidades en el carrito
        const availableStock = productInfo.stock + productInCart.quantity;

        if (productInCart.quantity <= availableStock) {
          ticketProducts.push({
            product: productInCart.product,
            quantity: productInCart.quantity,
            productInfo: {
              title: productInfo.title,
              description: productInfo.description,
              price: productInfo.price,
            },
          });
          totalAmountSold += productInCart.quantity * productInfo.price;
          logger.info(`Total amount: ${totalAmountSold}`);
        } else {
          logger.error(
            `Insufficient stock for product with ID ${productInCart.product}`
          );
          productsWithInsufficientStock.push(productInfo.title);
        }
      }

      // Verificar si algunos productos tienen stock insuficiente debido a reservas temporales
      if (productsWithInsufficientStock.length > 0) {
        return {
          status: "error",
          message: `Los siguientes productos no tienen suficiente stock disponible: ${productsWithInsufficientStock.join(
            ", "
          )}`,
        };
      }

      // Si todos los productos tienen suficiente stock, procede con la compra
      cart.products = [];
      await cartModel.updateOne({ _id: cid }, { products: [] });

      // Restar el stock reservado del stock disponible para cada producto en el carrito
      for (const productInCart of cart.products) {
        const product = await productModel.findById(productInCart.product);
        if (product) {
          product.stock -= productInCart.quantity;
          await product.save();
        }
      }

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

      const generateTicket = await ticketsModel.create(newTicket);

      // Guardar los cambios en el carrito después de la compra
      await cart.save();

      return {
        generateTicket,
        status: "success",
        message: "Compra realizada",
        amount: totalAmountSold,
        purchaser: userEmail,
        ticketProducts,
      };
    } catch (error) {
      logger.error("Error al realizar la compra:", error);
      throw new Error("Error al realizar la compra");
    }
  }
}

export const cartManager = new CartManager();
