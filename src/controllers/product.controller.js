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
      owner: user._id,
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

  try {
    // Obtener el producto y su owner
    const product = await productManager.findById(pid);
    const owner = product ? product.owner : null;

    // Verificar si el usuario es admin o el owner del producto
    if (req.session.role === "admin" || owner === req.session.email) {
      const response = await productManager.deleteOne(pid);
      if (response === -1) {
        res.status(400).json({ message: messages.PRODUCT_NOT_FOUND });
      } else {
        res.status(200).json({ message: "Product deleted" });
      }
    } else {
      throw Forbidden.createErr();
    }
  } catch (error) {
    logger.error(
      "Ha ocurrido un error al intentar eliminar este producto:",
      error
    );
    res.status(500).json({ message: error.message });
  }
}
/* //original y funcional 
async function deleteProduct(req, res) {
  const { pid } = req.params;
  logger.info(pid);
  try {
    const response = await productManager.deleteOne(pid);
    if (response === -1) {
      res.status(400).json({ message: messages.PRODUCT_NOT_FOUND });
    } else {
      res.status(200).json({ message: "Product deleted" });
    }
  } catch (error) {
    logger.error("Ha courrido un error al intentar eliminar este producto");
    res.status(500).json({ message: error });
  }
}
*/
async function updateProduct(req, res) {
  const { pid } = req.params;
  try {
    const response = await productManager.updateOne(pid, req.body);
    if (response === -1) {
      res.status(400).json({ message: messages.PRODUCT_NOT_FOUND });
    } else {
      res.status(200).json({ message: "Poduct updated" });
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
