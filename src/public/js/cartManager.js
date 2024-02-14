document.addEventListener("DOMContentLoaded", () => {
  const cartIdElement = document.getElementById("cart-id");
  const cartId = cartIdElement.dataset.cartId;
  const addUnitButtons = document.querySelectorAll(".add-to-cart-btn");
  const deleteUnitButtons = document.querySelectorAll(".delete-to-cart-btn");
  const purchaseCartButtons = document.querySelectorAll(".purchase-cart-btn");

  addUnitButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.cartId;
      addToCart(cartId, productId);
    });
  });

  deleteUnitButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.id;
      deleteUnitFromCart(cartId, productId);
    });
  });

  purchaseCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const cartId = button.id;
      purchaseCart(cartId);
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
  })
    .then((response) => {
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
      } else {
        // Si la solicitud falló, mostrar una notificación de error al usuario
        Swal.fire(
          "¡Error al agregar producto al carrito!",
          "Ocurrió un error al intentar agregar el producto al carrito.",
          "error"
        );
      }
    })
    .catch((error) => {
      // Si hubo un error, mostrar una notificación de error al usuario
      console.error("Error al agregar producto al carrito:", error);
      Swal.fire(
        "¡Error al agregar producto al carrito!",
        "Ocurrió un error al intentar agregar el producto al carrito.",
        "error"
      );
    });
}

function deleteUnitFromCart(cartId, productId) {
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => {
      if (response.ok) {
        // Si la solicitud fue exitosa, actualizar la página
        location.reload();

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
          title: "¡Unidad eliminada del carrito!",
        });
      } else {
        Swal.fire(
          "¡Error al eliminar unidad del carrito!",
          "Ocurrió un error al intentar eliminar la unidad del carrito.",
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error al eliminar unidad del carrito:", error);
      Swal.fire(
        "¡Error al eliminar unidad del carrito!",
        "Ocurrió un error al intentar eliminar la unidad del carrito.",
        "error"
      );
    });
}

function purchaseCart(cartId) {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(new Error("Error al realizar la compra"));
      }
    })
    .then((data) => {
      if (data.ticketMessage) {
        // Verificamos si hay un ticketMessage en la respuesta
        Swal.fire({
          // Mostramos el ticketMessage usando SweetAlert2
          icon: "success",
          title: "¡Compra realizada con éxito!",
          html: data.ticketMessage,
          showConfirmButton: true,
          confirmButtonText: "Cerrar",
        }).then((result) => {
          // Manejar el evento cuando se hace clic en el botón "Cerrar"
          if (result.isConfirmed) {
            // Recargar la página después de que el usuario presione el botón "Cerrar"
            location.reload();
          }
        });
      } else {
        console.error(
          "Error al realizar la compra: No se recibió el ticket del servidor"
        );
        Swal.fire(
          "Error",
          "Error al realizar la compra: No se recibió el ticket del servidor",
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error al realizar la compra:", error);
      Swal.fire(
        "Error",
        error.message || "Error al realizar la compra",
        "error"
      );
    });
}
