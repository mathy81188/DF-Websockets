import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo";
import passport from "passport";
import { engine } from "express-handlebars";
import viewsRouter from "./router/views.router.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import "./db/config.js";
import "./passport.js";
import usersRouter from "./router/users.router.js";
import productsRouter from "./router/products.router.js";
import cartRouter from "./router/carts.router.js";
import { productManager } from "./Dao/MongoDB/product.js";
import { messageManager } from "./Dao/MongoDB/message.js";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//session
const URI =
  "mongodb+srv://matiasbritez88:matias1188@codercluster0.j6xuhmy.mongodb.net/ecommerce?retryWrites=true&w=majority";
app.use(
  session({
    secret: "SESSIONSECRETKEY",
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    store: new mongoStore({
      mongoUrl: URI,
    }),
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

//handlebars
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//views
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/chat", viewsRouter);
app.use("/api/users", usersRouter);

//server
const httpServer = app.listen(8080, () => {
  console.log("escuchando puerto 8080");
});

//socket
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log(`cliente conectado ${socket.id}`);

  socket.on("addProduct", async (product) => {
    const newProduct = await productManager.create(product);
    socket.emit("productCreated", newProduct);
  });

  socket.on("deleteProduct", async (id) => {
    const deletedProduct = await productManager.deleteOne(+id);
    socket.emit("productDeleted", deletedProduct);

    const updatedProducts = await productManager.find({});
    socketServer.emit("updatedProducts", updatedProducts);
  });
});
const messages = [];
socketServer.on("connection", (socket) => {
  socket.on("newUser", (user) => {
    socket.broadcast.emit("newUserBroadcast", user);
  });

  socket.on("message", async (info) => {
    await messageManager.create(info);
    messages.push(info);
    socketServer.emit("chat", messages);
  });
});
