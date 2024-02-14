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
    res.status(200).json({ message: "Carrito creado con exito", newCart });
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
    let userRole;

    // Verificar si el usuario ha iniciado sesión con Google Passport o correo electrónico y contraseña
    if (req.user) {
      // Obtener el rol del usuario a través de req.user
      userRole = req.user.role;
    } else {
      // Obtener el rol del usuario a través de req.session
      userRole = req.session.role;
    }
    // Obtener información completa del producto
    const productInfo = await productManager.findById(pid);

    if (!productInfo) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (userRole === "premium") {
      // Verificar si el usuario intenta agregar un producto propio
      if (productInfo.owner === req.session.email) {
        return res.status(403).json({
          message: "Premium users cannot add their own products to the cart",
        });
      }
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
    const { cid } = req.params;
    const purchaseResult = await cartManager.purchaseCartById(cid); // Llamada al método para comprar el carrito

    if (purchaseResult.status === "success") {
      const { generateTicket, amount, purchaser, ticketProducts } =
        purchaseResult;

      // Construimos el mensaje del ticket
      const ticketMessage = `
        <h2>Ticket de Compra</h2>
        <p><strong>Código:</strong> ${generateTicket.code}</p>
        <p><strong>Fecha de Compra:</strong> ${new Date(
          generateTicket.purchase_datetime
        ).toLocaleString()}</p>
        <p><strong>Importe Total:</strong> $${amount}</p>
        <p><strong>Comprador:</strong> ${purchaser}</p>
        <h3>Productos:</h3>
        <ul>
          ${ticketProducts
            .map(
              (product) =>
                `<li>${product.productInfo.title} - Cantidad: ${product.quantity} - Precio: $${product.productInfo.price}</li>`
            )
            .join("")}
        </ul>
      `;

      res.status(200).json({ message: "Cart purchase", ticketMessage });
    } else {
      res.status(400).json({ message: purchaseResult.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al realizar la compra" });
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
