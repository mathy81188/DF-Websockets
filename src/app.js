import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo";
import passport from "passport";
import { engine } from "express-handlebars";
import { logger } from "./utils/winston.js";
import { __dirname } from "./utils/utils.js";
import { join } from "path";
import { Server } from "socket.io";
import config from "./config/config.js";
import "./utils/passport.js";
import { specs } from "./utils/swagger.js";
import { manageProductsHbs, manageMessagesHbs } from "./public/hbs.js";
import swaggerUiExpress from "swagger-ui-express";
//routers
import viewsRouter from "./router/views.router.js";
import messageRouter from "./router/messages.router.js";
import usersRouter from "./router/users.router.js";
import productsRouter from "./router/products.router.js";
import cartRouter from "./router/carts.router.js";
import sessionRouter from "./router/sessions.router.js";
import mockRouter from "./router/mockingProducts.router.js";
import loggerRouter from "./router/logger.router.js";

import { errorMidlleware } from "./middlewares/error.midlleware.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "../public")));

//session
const URI = config.mongouri;
const SESSION = config.sessionSecret;

app.use(
  session({
    secret: SESSION,
    resave: false,
    saveUninitialized: true,
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
app.set("views", join(__dirname, "../views"));
app.set("view engine", "handlebars");

//SWAGGER

app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//views
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/chat", viewsRouter);
app.use("/api/users", usersRouter);

//googleStrategy
app.use("/api/sessions", sessionRouter);

//nodemailer
app.use("/api/messages", messageRouter);

//winston
app.use("/loggerTest", loggerRouter);

//Faker
app.use("/mockingproducts", mockRouter);

//server
const httpServer = app.listen(8080, () => {
  logger.debug("escuchando puerto 8080");
});

//socket
const socketServer = new Server(httpServer);

const onConnection = async (socket) => {
  logger.info(`cliente conectado ${socket.id}`);
  await manageProductsHbs(socketServer, socket);
  await manageMessagesHbs(socketServer, socket);
};

socketServer.on("connection", onConnection);

//manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error interno del servidor");
});
