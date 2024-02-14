const socketClient = io();

const form = document.getElementById("chatForm");
const inputMessage = document.getElementById("chatMessage");
const h3Name = document.getElementById("name");
const divChat = document.getElementById("chat");

let user;

Swal.fire({
  title: "Welcome",
  text: "What is your email",
  input: "text",
  inputValidator: (value) => {
    if (!value) {
      return "Email is required";
    }
  },
  confirmButtonText: "Enter",
}).then((input) => {
  user = input.value;
  h3Name.innerText = `Chat user: ${user}`;
  socketClient.emit("newUser", user);
});

socketClient.on("chat", (message) => {
  const chatMessage = `<p>${message.user}: ${message.message}</p>`;

  divChat.innerHTML += chatMessage;
});

form.onsubmit = (e) => {
  e.preventDefault();
  const infoMessage = {
    user: user,
    message: inputMessage.value,
  };
  socketClient.emit("message", infoMessage);
};
