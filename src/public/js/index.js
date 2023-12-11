console.log("probando");
const socketClient = io();
const form = document.getElementById("form");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputPrice = document.getElementById("price");
const table = document.getElementById("table");
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
  const row = `
    <tr>
    
         
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <button class="delete-button" data-product-id=${product.id}}>Delete</button>
           
        </tr>`;
  table.innerHTML += row;
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-button")) {
    e.preventDefault();
    const productId = e.target.getAttribute("data-product-id");
    socketClient.emit("deleteProduct", productId);
  }
});

socketClient.on("updateProducts", (product) => {
  table.innerHTML = "";

  product.forEach((product) => {
    const row = `
      <tr>
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>
          <button class="delete-button" data-product-id="${product.id}">Delete</button>
        </td>
      </tr>`;
    table.innerHTML += row;
  });
});
