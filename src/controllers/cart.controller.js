import { cartManager } from "../Dao/MongoDB/cart.js";
import { productManager } from "../Dao/MongoDB/product.js";
import { usersManager } from "../Dao/MongoDB/users.js";
import { messages } from "../errors/error.dictionary.js";
import { logger } from "../utils/winston.js";

async function getAllCarts(req, res) {
  try {
    const carts = await cartManager.getAllCarts(req.query);
    logger.debug("Carritos encontrado", carts);
    res.status(200).json({ message: "Carts found", carts });
  } catch (error) {
    logger.error("Error al intentar acceder a todos los carts", {
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
}

async function newCart(req, res) {
  try {
    const newCart = await cartManager.createCart(req.body);
    logger.info("Nuevo carrito creado con éxito", { cart: newCart });
    res.status(200).json({ message: "Carrito creado con exito ", newCart });
    return newCart;
  } catch (error) {
    logger.error("Error al intentar crear un nuevo carrito", {
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
}

async function findCart(req, res) {
  try {
    const { cid } = req.params;
    const cart = await cartManager.findCartById(cid);
    logger.debug("Carrito encontrado", { cartId: cid, cart });
    res.status(200).json({ message: "Cart found", cart });
  } catch (error) {
    logger.error("Error al intentar encontrar un carrito", {
      error: error.message,
    });
    res.status(500).json({ message: messages.CART_NOT_FOUND });
  }
}

async function deleteCart(req, res) {
  try {
    const { cid } = req.params;
    const cart = await cartManager.deleteOne(cid);
    logger.info("Carrito eliminado con éxito", { cartId: cid });
    res.status(200).json({ message: "Cart deleted" });
  } catch (error) {
    logger.error("Error al intentar eliminar un carrito", {
      error: error.message,
    });
    res.status(500).json({ message: messages.CART_NOT_FOUND });
  }
}

async function deleteProductByIdFromCart(req, res) {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.deleteProductToCart(cid, pid);
    res.status(200).json({ message: "Product deleted from Cart", cart });
  } catch (error) {
    res.status(500).json({ message: messages.PRODUCT_NOT_FOUND });
  }
}

async function updateCart(req, res) {
  try {
    const { cid } = req.params;
    const updatedCart = await cartManager.updateOne(cid, req.body);
    if (updatedCart) {
      res.status(200).json({ message: "Cart edited" });
    } else {
      res.status(400).json({ message: "Cart not found with the id" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProductByIdFromCartById(req, res) {
  try {
    const { cid, pid } = req.params;
    const userRole = req.session.role;
    console.log("userRole", userRole);

    // Obtener información completa del producto
    const productInfo = await productManager.findById(pid);

    if (!productInfo) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verificar el rol y el propietario del producto
    if (userRole === "premium" && productInfo.owner !== req.session.email) {
      return res.status(403).json({
        message:
          "Premium users cannot add products owned by others to the cart",
      });
    }

    // Llamar a la función de manager solo si la validación es exitosa
    const cart = await cartManager.updateProductFromCart(cid, pid);

    return res.status(200).json({ message: "Product edited", cart });
  } catch (error) {
    res.status(500).json({ message: "Producto sin stock" });
  }
}

async function purchaseCart(req, res) {
  try {
    const { cid, id } = req.params;
    const cart = await cartManager.purchaseCartById(cid);
    const user = await usersManager.findById(id);
    logger.info("Carrito comprado con éxito", { cartId: cid, userId: id });
    res.status(200).json({ message: "Cart purchase", cart });
  } catch (error) {
    logger.error("Error al intentar comprar un carrito", {
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
}

export {
  getAllCarts,
  newCart,
  findCart,
  deleteCart,
  deleteProductByIdFromCart,
  updateCart,
  updateProductByIdFromCartById,
  purchaseCart,
};
