//const socketClient = io();
//const cartQuantityElement = document.getElementById("cart-quantity");
//const productsContainer = document.getElementById("products-container");

// addtocart.js

document.addEventListener("DOMContentLoaded", () => {
  const cartIdElement = document.getElementById("cart-id");
  const cartId = cartIdElement.dataset.cartId;
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const stockElement = document.querySelector(`#stock-${productId}`);
      const stock = parseInt(stockElement.textContent.trim());

      if (stock > 0) {
        addToCart(cartId, productId);
      } else {
        // Mostrar un mensaje de que el producto está fuera de stock
        Swal.fire(
          "¡Producto fuera de stock!",
          "Lo sentimos, este producto está agotado.",
          "info"
        );
      }
    });
  });
});

// Función para enviar la solicitud al servidor para agregar productos al carrito
function addToCart(cartId, productId) {
  // Realizar una solicitud HTTP para agregar el producto al carrito
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  }).then((response) => {
    if (response.ok) {
      // Si la solicitud fue exitosa, actualizar la página
      location.reload();
      // Si la solicitud fue exitosa, mostrar una notificación al usuario
      const swalInstance = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
      swalInstance.fire({
        icon: "success",
        title: "¡Producto agregado al carrito!",
      });
    } else if (response.status === 403) {
      // Si la solicitud fue prohibida (403), mostrar un mensaje específico para usuario premium
      Swal.fire(
        "¡No se pudo agregar al carrito!",
        "Los usuarios premium no pueden agregar sus propios productos al carrito.",
        "warning"
      );
    } else {
      // Si la solicitud falló por alguna otra razón, mostrar una notificación de error al usuario
      Swal.fire(
        "¡Error al agregar producto al carrito!",
        "Ocurrió un error al intentar agregar el producto al carrito.",
        "error"
      );
    }
  });
}
