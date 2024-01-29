const socketClient = io();
const cartQuantityElement = document.getElementById("cart-quantity");
const productsContainer = document.getElementById("products-container");

document.addEventListener("DOMContentLoaded", () => {
  socketClient.emit("getCart"); // Cambia el evento según tu lógica
});

// Manejar la adición de productos al carrito
socketClient.on("addToCart", (updatedCart) => {
  console.log("Carrito actualizado:", updatedCart);
  actualizarInterfazUsuario(updatedCart);
});

// Manejar eventos de actualización del carrito
socketClient.on("cartUpdated", (updatedCart) => {
  console.log("Carrito actualizado:", updatedCart);
  actualizarInterfazUsuario(updatedCart);
});

// Función para actualizar la interfaz de usuario
function actualizarInterfazUsuario(cart) {
  // Actualizar la cantidad de productos en el carrito
  if (cartQuantityElement) {
    cartQuantityElement.innerText = cart.products.length.toString();
  }

  // Actualizar la visualización de productos en el carrito
  if (productsContainer) {
    renderProducts(cart.products);
  }
}

// Función para renderizar productos en el carrito
function renderProducts(products) {
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    addProductToContainer(product);
  });
}

// Función para agregar un producto al contenedor
function addProductToContainer(product) {
  const productDiv = document.createElement("div");
  productDiv.innerHTML = `
    <h1>${product.title}</h1>
    <h2>Precio $${product.price}</h2>
    <h2>Stock ${product.stock}</h2>
    <button onclick="addToCart('${product._id}')">Agregar al Carrito</button>
    <button onclick="increaseQuantity('${product._id}')">+</button>
    <button onclick="decreaseQuantity('${product._id}')">-</button>
  `;

  productsContainer.appendChild(productDiv);
}
