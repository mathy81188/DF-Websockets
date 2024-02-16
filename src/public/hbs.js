import { productManager } from "../Dao/MongoDB/product.js";
import { messageManager } from "../Dao/MongoDB/message.js";

async function manageProductsHbs(io, socket) {
  socket.on("addProduct", async (product) => {
    const newProduct = await productManager.create(product);

    socket.emit("productCreated", newProduct);

    const updatedProducts = await productManager.find({});
    io.sockets.emit("updateProducts", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    const deletedProduct = await productManager.deleteOne(id);

    socket.emit("productDeleted", deletedProduct);

    const updatedProducts = await productManager.find({});
    io.sockets.emit("updateProducts", updatedProducts);
  });

  socket.on("getProducts", async () => {
    const products = await productManager.find({});
    io.sockets.emit("initialProducts", products);
  });
}

async function manageMessagesHbs(io, socket) {
  socket.on("message", async (info) => {
    const role = await messageManager.findByEmail(info.user);
    console.log("User Role:", role);

    if (role === "user") {
      await messageManager.create(info);

      const messageWithUser = { ...info, role };

      // Emitir solo el mensaje recién enviado a todos los clientes
      io.sockets.emit("chat", messageWithUser);
    } else {
      console.log("Unauthorized user attempted to send a message");
    }
  });
}

export { manageProductsHbs, manageMessagesHbs };
