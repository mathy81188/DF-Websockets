import { logger } from "../../winston";

logger.info("probando");

const socketClient = io();
const form = document.getElementById("form");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputPrice = document.getElementById("price");
const inputStock = document.getElementById("stock");
const table = document.getElementById("table");
/*// chat
document.addEventListener("DOMContentLoaded", () => {
  socketClient.emit("getProducts");
});

form.onsubmit = (e) => {
  e.preventDefault();
  const product = {
    title: inputTitle.value,
    description: inputDescription.value,
    price: inputPrice.value,
    stock: inputStock.value,
    owner: "{{session.email}}", // Agrega el campo owner
  };

  if (!product.title || !product.price) {
    logger.error("Title and price are required");
    return;
  }

  socketClient.emit("addProduct", product);
};

socketClient.on("productCreated", (product) => {
  addProductToTable(product);
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-button")) {
    e.preventDefault();
    const productId = e.target.getAttribute("data-product-id");
    socketClient.emit("deleteProduct", productId);
  }
});

socketClient.on("updateProducts", (products) => {
  renderProducts(products);
});

socketClient.on("initialProducts", (products) => {
  renderProducts(products);
});

function addProductToTable(product) {
  const row = `
    <tr>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td><button class="delete-button" data-product-id="${product._id}">Delete</button></td>
    </tr>`;
  table.innerHTML += row;
}

function renderProducts(products) {
  table.innerHTML = "";

  products.forEach((product) => {
    addProductToTable(product);
  });
}
*/
// original y funcional
document.addEventListener("DOMContentLoaded", () => {
  socketClient.emit("getProducts");
});

form.onsubmit = (e) => {
  e.preventDefault();
  const product = {
    title: inputTitle.value,
    description: inputDescription.value,
    price: inputPrice.value,
    stock: inputStock.value,
  };

  if (!product.title || !product.price) {
    logger.error("Title and price are required");
    return;
  }

  socketClient.emit("addProduct", product);
};

socketClient.on("productCreated", (product) => {
  addProductToTable(product);
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-button")) {
    e.preventDefault();
    const productId = e.target.getAttribute("data-product-id");
    socketClient.emit("deleteProduct", productId);
  }
});

socketClient.on("updateProducts", (products) => {
  renderProducts(products);
});

socketClient.on("initialProducts", (products) => {
  renderProducts(products);
});

function addProductToTable(product) {
  const row = `
    <tr>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td><button class="delete-button" data-product-id="${product._id}">Delete</button></td>
    </tr>`;
  table.innerHTML += row;
}

function renderProducts(products) {
  table.innerHTML = "";

  products.forEach((product) => {
    addProductToTable(product);
  });
}
