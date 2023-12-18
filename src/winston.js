import winston from "winston";
import config from "./config.js";

const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

const colors = {
  debug: "blue",
  http: "green",
  info: "cyan",
  warning: "yellow",
  error: "red",
  fatal: "magenta",
};

const developmentLogger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console({ level: "debug" })],
});

// Configuración del logger para producción
const productionLogger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
});

const logger =
  config.node_env === "production" ? productionLogger : developmentLogger;

export { logger };
