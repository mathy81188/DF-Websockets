const token = "someToken";

const resetPasswordLink = document.getElementById("resetPasswordLink");
resetPasswordLink.href = `/api/users/regenerate-password-reset/${token}`;

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        window.location.href = "/"; // Redirige al usuario si el inicio de sesión es exitoso
      } else {
        document.getElementById("errorMessage").style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
