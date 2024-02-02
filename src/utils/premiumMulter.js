import multer from "multer";
import { join } from "path";
import { __dirname } from "./utils.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.fieldname;
    console.log("file.fieldname", file.fieldname);

    console.log("req.body", req.body);

    if (fileType === "estadoDeCuenta") {
      cb(null, join(__dirname, "../img/premium/estadoDeCuenta"));
    } else if (fileType === "domicilio") {
      cb(null, join(__dirname, "../img/premium/domicilio"));
    } else if (fileType === "identificacion") {
      cb(null, join(__dirname, "../img/premium/identificacion"));
    } else {
      return cb(new Error("Tipo de archivo no válido"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadPremium = multer({ storage });
