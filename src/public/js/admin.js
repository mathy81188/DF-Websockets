document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("submit");
  searchButton.addEventListener("click", function (event) {
    event.preventDefault();

    const userId = document.getElementById("userId").value;

    fetch(`http://localhost:8080/admin/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const userInfoDiv = document.getElementById("userInfo");
        if (data.user) {
          userInfoDiv.innerHTML = `
                <h2>Información del Usuario</h2>
                <p>ID: ${data.user._id}</p>
                <p>Nombre de Usuario: ${data.user.first_name}</p>
                <p>Rol Actual: ${data.user.role}</p>
                <form action="http://localhost:8080/admin/user/${data.user._id}/modify-role" method="POST"  id="roleForm" data-user-id="${data.user._id}">
                  <label for="role">Nuevo Rol:</label>
                  <select id="role" name="role">
                    <option value="premium">Premium</option>
                    <option value="user">User</option>
                  </select>
                  <button type="button" id="submitRole">Modificar Rol</button> 
                </form>
                <form action="/admin/user/${data.user._id}/delete" method="POST" id="deleteForm">
                  <button id="deleteBtn"
                    type="submit"
                    onclick="return confirm('¿Estás seguro de que deseas eliminar este usuario?')"
                  >Eliminar Usuario</button>
                </form>
              `;
          userInfoDiv.style.display = "block"; // Mostrar la información del usuario

          const submitRoleButton = document.getElementById("submitRole");
          submitRoleButton.addEventListener("click", async function (event) {
            event.preventDefault();
            const confirmModifyRole = await Swal.fire({
              title:
                "¿Estás seguro de que deseas modificar el rol de este usuario?",
              text: "Esta acción cambiará el rol del usuario.",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Sí, modificar",
              cancelButtonText: "Cancelar",
            });
            if (confirmModifyRole.isConfirmed) {
              const roleForm = document.getElementById("roleForm");
              roleForm.submit(); // Enviar el formulario para modificar el rol
            }
          });

          const deleteButton = document.getElementById("deleteBtn");
          deleteButton.addEventListener("click", async function (event) {
            event.preventDefault();
            const confirmDelete = await Swal.fire({
              title: "¿Estás seguro de que deseas eliminar este usuario?",
              text: "Esta acción no se puede deshacer.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Sí, eliminar",
              cancelButtonText: "Cancelar",
            });
            if (confirmDelete.isConfirmed) {
              const deleteForm = document.getElementById("deleteForm");
              deleteForm.submit(); // Enviar el formulario
            }
          });
        } else {
          userInfoDiv.innerHTML = "Usuario no encontrado";
          userInfoDiv.style.display = "block"; // Mostrar el mensaje de usuario no encontrado
        }
      })
      .catch((error) => console.error("Error:", error));
  });
});
