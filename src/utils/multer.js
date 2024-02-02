import multer from "multer";
import { join } from "path";
import { __dirname } from "./utils.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = req.body.fileType;

    if (fileType === "profile") {
      cb(null, join(__dirname, "../img/profile"));
    } else if (fileType === "product") {
      cb(null, join(__dirname, "../img/product"));
    } else if (fileType === "document") {
      cb(null, join(__dirname, "../img/document"));
    } else {
      return cb(new Error("Tipo de archivo no válido"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
