import { Router } from "express";
import { messageManager } from "../Dao/MongoDB/message";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roles } from "../constants.js";
const router = Router();

router.post("/", authMiddleware([roles.USER]), async (req, res) => {
  const { user, message } = req.body;
  if (!user || !message) {
    return res.status(400).json({ message: "Some data is missing" });
  }
  try {
    const messages = await messageManager.create(req.body);

    res.status(200).json({ message: "message created", chat: messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
