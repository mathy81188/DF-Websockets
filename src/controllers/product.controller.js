import { hash } from "bcrypt";
import { productManager } from "../Dao/MongoDB/product.js";
import { messages } from "../errors/error.dictionary.js";
import { logger } from "../utils/winston.js";
import { usersManager } from "../Dao/MongoDB/users.js";

async function getAllProducts(req, res) {
  try {
    const product = await productManager.getAll(req.query);
    logger.debug("Productos encontrado", product);
    res.json({ status: "success", payload: product });
  } catch (error) {
    logger.error("Error al intentar acceder a todos los productos", {
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
}

async function findByProductId(req, res) {
  const { pid } = req.params;
  try {
    const product = await productManager.findById(pid);
    logger.debug("Producto encontrado", product);
    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    logger.error("Error al acceder ala informacion del producto");
    res.status(500).json(messages.PRODUCT_NOT_FOUND);
  }
}

async function createProduct(req, res) {
  const { title, description, price, stock } = req.body;

  if (!title || !description || !price || !stock) {
    return res.status(400).json({ message: messages.FIELDS_REQUIRED });
  }

  const userEmail = req.session.email;
  console.log("userEmail", userEmail);

  try {
    const user = await usersManager.findByEmail(userEmail);
    console.log("owner", user);
    const newProd = await productManager.create({
      title,
      description,
      price,
      stock,
      owner: user.email,
    });
    logger.debug("Producto creado con éxito", newProd);
    res.status(200).json({ message: "Product created", prod: newProd });
  } catch (error) {
    logger.error("Ha ocurrido un error al crear este producto");
    res.status(500).json({ message: error.message });
  }
}
async function deleteProduct(req, res) {
  const { pid } = req.params;
  const sesion = req.session;
  console.log("sesion", sesion);

  try {
    const product = await productManager.findById(pid);
    console.log("product", product);

    if (!product) {
      return res.status(400).json({ message: messages.PRODUCT_NOT_FOUND });
    }

    // Verificar si el usuario es admin o el propietario del producto
    if (
      req.session.role === "admin" ||
      (req.session.role === "premium" && product.owner === req.session.email)
    ) {
      const response = await productManager.deleteOne(pid);
      console.log("response", response);

      if (response === -1) {
        return res.status(400).json({ message: messages.PRODUCT_NOT_FOUND });
      } else {
        return res.status(200).json({ message: "Product deleted" });
      }
    } else {
      return res
        .status(403)
        .json({ message: "No tienes permisos para realizar esta acción" });
    }
  } catch (error) {
    logger.error(
      "Ha ocurrido un error al intentar eliminar este producto:",
      error
    );
    return res.status(500).json({ message: error.message });
  }
}

async function updateProduct(req, res) {
  const { pid } = req.params;
  try {
    const response = await productManager.updateOne(pid, req.body);
    if (response === -1) {
      res.status(400).json({ message: messages.PRODUCT_NOT_FOUND });
    } else {
      res.status(200).json({ message: "Product updated" });
    }
  } catch (error) {
    logger.error("Ha courrido un error al intentar editar este producto");
    res.status(500).json({ message: error });
  }
}
export {
  getAllProducts,
  findByProductId,
  createProduct,
  deleteProduct,
  updateProduct,
};
