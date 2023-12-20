import Jwt from "jsonwebtoken";
import { logger } from "../winston";
const jwt_secret = "jwt";

export const jwtValidation = (req, res, next) => {
  try {
    const header = req.get("Authorization");
    const token = header.split(" ")[1];
    const responseToken = Jwt.verify(token, jwt_secret);
    req.user = responseToken;
    logger.info("resToken", responseToken);
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
