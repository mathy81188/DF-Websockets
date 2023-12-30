import { Router } from "express";
import { transporter } from "../utils/nodamailer.js";

const router = Router();

router.get("/", async (req, res) => {
  const options = {
    from: "",
    to: "",
    subject: "probando envio de mail",
    text: "primer mail enviado",
  };
  await transporter.sendMail(options);
  res.send("enviando mail");
});

export default router;
