import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo";
import passport from "passport";
import { engine } from "express-handlebars";
import viewsRouter from "./router/views.router.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import config from "./config/config.js";
import "./utils/passport.js";
import { generateMockingproducts } from "./utils/faker.js";
import { logger } from "./utils/winston.js";
import usersRouter from "./router/users.router.js";
import productsRouter from "./router/products.router.js";
import cartRouter from "./router/carts.router.js";
import sessionRouter from "./router/sessions.router.js";
import { productManager } from "./Dao/MongoDB/product.js";
import { messageManager } from "./Dao/MongoDB/message.js";
import messageRouter from "./router/messages.router.js";
import { errorMidlleware } from "./middlewares/error.midlleware.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

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
app.use(errorMidlleware);
//passport
app.use(passport.initialize());
app.use(passport.session());

//handlebars

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//SWAGGER

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API del Ecommerce",
      description: "Series Y Peliculas",
    },
  },

  apis: [`${__dirname}/docs/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//views
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/chat", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/messages", messageRouter);

//winston
app.get("/loggerTest", (req, res) => {
  console.log("probando winston");
  logger.debug("Este es un mensaje de debug");
  logger.http("Este es un mensaje de http");
  logger.info("Este es un mensaje de info");
  logger.warning("Este es un mensaje de warning");
  logger.error("Este es un mensaje de error");
  logger.fatal("Este es un mensaje fatal");
  res.send("probando winston logs");
});
//Faker
app.use("/mockingproducts", (req, res) => {
  const products = [];
  for (let index = 0; index < 100; index++) {
    const product = generateMockingproducts();
    products.push(product);
  }
  res.json(products);
});

//server
const httpServer = app.listen(8080, () => {
  logger.debug("escuchando puerto 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  logger.info(`cliente conectado ${socket.id}`);

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
