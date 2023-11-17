import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const jwt_secret = "jwt";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashData = async (data) => {
  const hash = await bcrypt.hash(data, 10);
  return hash;
};

export const compareData = async (data, hashData) => {
  return bcrypt.compare(data, hashData);
};

export const generateToken = (user) => {
  const token = Jwt.sign(user, jwt_secret);
  return token;
};
