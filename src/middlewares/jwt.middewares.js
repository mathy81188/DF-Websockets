import Jwt from "jsonwebtoken";
const jwt_secret = "jwt";

export const jwtValidation = (req, res, next) => {
  try {
    const header = req.get("Authorization");
    const token = header.split(" ")[1];
    const responseToken = Jwt.verify(token, jwt_secret);
    req.user = responseToken;
    console.log("resToken", responseToken);
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
