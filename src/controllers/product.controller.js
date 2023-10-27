import { productManager } from "../Dao/MongoDB/product.js";

async function getAllProducts(req, res) {
  try {
    const product = await productManager.getAll(req.query);

    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function findByProductId(req, res) {
  const { pid } = req.params;
  try {
    const product = await productManager.findById(pid);
    if (!product) {
      res.status(400).json({ message: "Product not found with the id" });
    }
    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createProduct(res, req) {
  const { title, description, price } = req.body;
  if (!title || !description || !price) {
    return res.status(400).json({ message: "Some data is missing" });
  }
  try {
    const newProd = await productManager.create(req.body);

    res.status(200).json({ message: "Product created", prod: newProd });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteProduct(req, res) {
  const { pid } = req.params;
  console.log(pid);
  try {
    const response = await productManager.deleteOne(pid);
    if (response === -1) {
      res.status(400).json({ message: "Product not found with the id" });
    } else {
      res.status(200).json({ message: "Product deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function updateProduct(req, res) {
  const { pid } = req.params;
  try {
    const response = await productManager.updateOne(pid, req.body);
    if (response === -1) {
      res.status(400).json({ message: "Product not found with the id" });
    } else {
      res.status(200).json({ message: "Poduct updated" });
    }
  } catch (error) {
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
