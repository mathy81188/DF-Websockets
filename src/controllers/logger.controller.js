import { logger } from "../utils/winston.js";

async function loggerTest(req, res) {
  try {
    console.log("probando winston");
    logger.debug("Este es un mensaje de debug");
    logger.http("Este es un mensaje de http");
    logger.info("Este es un mensaje de info");
    logger.warning("Este es un mensaje de warning");
    logger.error("Este es un mensaje de error");
    logger.fatal("Este es un mensaje fatal");
    res.send("probando winston logs");
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export { loggerTest };
