console.log("probando");
const socketClient = io();
const form = document.getElementById("form");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputPrice = document.getElementById("price");
const table = document.getElementById("table");
const tableBody = document.getElementById("tableBody");

const button = document.getElementById("deletebtn");
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

deleteBtn.on = (e, id) => {
  e.preventDefault();

  socketClient.emit("deleteProduct", id);
};

socketClient.on("productDeleted", (id) => {
  let encontrarId = products.find((element) => element.id === id);

  products = products.filter((productId) => {
    return productId !== encontrarId;
  });
});
