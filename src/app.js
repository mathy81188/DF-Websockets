import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo";
import passport from "passport";
import { engine } from "express-handlebars";
import viewsRouter from "./router/views.router.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import config from "./config.js";
import "./passport.js";
import usersRouter from "./router/users.router.js";
import productsRouter from "./router/products.router.js";
import cartRouter from "./router/carts.router.js";
import sessionRouter from "./router/sessions.router.js";
import { productManager } from "./Dao/MongoDB/product.js";
import { messageManager } from "./Dao/MongoDB/message.js";
import messageRouter from "./router/messages.router.js";
import { errorMidlleware } from "./middlewares/error.midlleware.js";
import { generateMockingproducts } from "../faker.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//session

const URI = config.mongouri;
const SESSION = config.sessionSecret;
// ;
app.use(
  session({
    secret: SESSION,
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
app.use("/api/sessions", sessionRouter);
app.use("/api/messages", messageRouter);

//Faker
app.use("/mockingproducts", (req, res) => {
  const products = [];
  for (let index = 0; index < 100; index++) {
    const product = generateMockingproducts();
    products.push(product);
  }
  res.json(products);
});
app.use(errorMidlleware);

//server
const httpServer = app.listen(8080, () => {
  console.log("escuchando puerto 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log(`cliente conectado ${socket.id}`);

  socket.on("addProduct", async (product) => {
    const newProduct = await productManager.create(product);

    socket.emit("productCreated", newProduct);

    const updatedProducts = await productManager.find({});
    socketServer.emit("updateProducts", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    const deletedProduct = await productManager.deleteOne(id);

    socket.emit("productDeleted", deletedProduct);

    const updatedProducts = await productManager.find({});
    socketServer.emit("updateProducts", updatedProducts);
  });

  socket.on("getProducts", async () => {
    const products = await productManager.find({});
    socket.emit("initialProducts", products);
  });
});

//MENSAJES
const messages = [];

socketServer.on("connection", (socket) => {
  socket.on("message", async (info) => {
    const role = await messageManager.findByEmail(info.user);
    console.log("User Role:", role);

    if (role === "user") {
      await messageManager.create(info);

      const messageWithUser = { ...info, role };
      messages.push(messageWithUser);

      socketServer.emit("chat", messages);
    } else {
      console.log("Unauthorized user attempted to send a message");

      socket.emit("unauthorizedAccess", { error: "Unauthorized user" });
    }
  });
});
