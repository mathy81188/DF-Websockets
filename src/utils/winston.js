import winston from "winston";
import config from "../config/config.js";

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
    http: "cyan",
    info: "green",
    warning: "grey",
    error: "magenta",
    fatal: "red",
  },
};

winston.addColors(myCustomLevels.colors);
export let logger;

if (config.node_env !== "production") {
  logger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.simple()
        ),
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "errors.log",
        level: "error",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
    ],
  });
}
