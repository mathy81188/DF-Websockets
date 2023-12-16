import { cartManager } from "../Dao/MongoDB/cart.js";
import { usersManager } from "../Dao/MongoDB/users.js";
import { messages } from "../errors/error.dictionary.js";

async function newCart(req, res) {
  try {
    const newCart = await cartManager.createCart(req.body);
    res.status(200).json({ message: "Carrito creado con exito ", newCart });
    return newCart;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function findCart(req, res) {
  try {
    const { cid } = req.params;
    const cart = await cartManager.findCartById(cid);
    res.status(200).json({ message: "Cart found", cart });
  } catch (error) {
    res.status(500).json({ message: messages.CART_NOT_FOUND });
  }
}

async function deleteCart(req, res) {
  try {
    const { cid } = req.params;
    const cart = await cartManager.deleteOne(cid);
    res.status(200).json({ message: "Cart deleted" });
  } catch (error) {
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
    const cart = await cartManager.updateProductFromCart(cid, pid);
    res.status(200).json({ message: "Product edited", cart });
  } catch (error) {
    res.status(500).json({ message: messages.PRODUCT_NOT_FOUND });
  }
}

async function purchaseCart(req, res) {
  try {
    const { cid, id } = req.params;
    const cart = await cartManager.purchaseCartById(cid);
    const user = await usersManager.findById(id);
    res.status(200).json({ message: "Cart purchase", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  newCart,
  findCart,
  deleteCart,
  deleteProductByIdFromCart,
  updateCart,
  updateProductByIdFromCartById,
  purchaseCart,
};
