document.addEventListener("DOMContentLoaded", function () {
  const uploadButton = document.getElementById("uploadButton");
  uploadButton.addEventListener("click", function () {
    window.location.href = "http://localhost:8080/upload";
  });

  const upgradeButton = document.getElementById("upgradeButton");
  upgradeButton.addEventListener("click", function () {
    window.location.href = "http://localhost:8080/upgrade";
  });
});
