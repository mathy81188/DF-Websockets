console.log("probando");
const socketClient = io();
const form = document.getElementById("form");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputPrice = document.getElementById("price");
const table = document.getElementById("table");
const tableBody = document.getElementById("tableBody");
const deleteBtn = document.getElementById("deleteBtn");

form.onsubmit = (e) => {
  e.preventDefault();
  const product = {
    title: inputTitle.value,
    description: inputDescription.value,
    price: inputPrice.value,
  };
  socketClient.emit("addProduct", product);
};

socketClient.on("productCreated", (product) => {
  const { id, title, description, price } = product;

  const row = `
    <tr>
    
            <td>${id}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${price}</td>
            <button>${deleteBtn}</button>
        </tr>`;
  table.innerHTML += row;
});

deleteBtn.addEventListener("click", (e, productId) => {
  e.preventDefault();

  socketClient.emit("deleteProduct", productId);
});

socketClient.on("updateProducts", (product) => {
  // table.innerHTML = "";
  const { id, title, description, price } = product;

  const row = `
    <tr>
    
            <td>${id}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${price}</td>
            <button>${deleteBtn}</button>
        </tr>`;
  table.innerHTML += row;
});
