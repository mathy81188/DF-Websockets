import winston from "winston";
import config from "./config.js";

const myCustomLevels = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0,
  },

  colors: {
    debug: "blue",
    http: "green",
    info: "cyan",
    warning: "yellow",
    error: "red",
    fatal: "magenta",
  },
};

const developmentLogger = winston.createLogger({
  levels: myCustomLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
  ],
});

// Configuración del logger para producción
const productionLogger = winston.createLogger({
  levels: myCustomLevels.levels,
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
});

const logger =
  config.node_env === "production" ? productionLogger : developmentLogger;

export { logger };
