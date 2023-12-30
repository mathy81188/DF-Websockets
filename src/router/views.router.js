import { Router } from "express";
import { productManager } from "../Dao/MongoDB/product.js";
import { cartManager } from "../Dao/MongoDB/cart.js";
import UserDTO from "../dto/user.dto.js";
import { usersManager } from "../Dao/MongoDB/users.js";

const router = Router();

router.get("/", async (req, res) => {
  const { email, first_name } = req.session;

  const products = await productManager.find({});
  res.render("index", { products, first_name, email });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.find();

  res.render("realTimeProducts", { products });
});

router.get("/current", (req, res) => {
  const currentUser = req.session;
  if (!currentUser) {
    return res.redirect("/login");
  }

  const userDTO = new UserDTO(currentUser);

  res.render("current", { userDTO });
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.findCartById(cid);
  res.render("cart", { cart });
});

router.get("/login", async (req, res) => {
  res.render("login");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;

  const userDB = await usersManager.findByResetToken(token);

  res.render("reset-password", { userDB, token });
});
router.get("/regenerate-password-reset/:token", async (req, res) => {
  const { token } = req.params;

  const userDB = await usersManager.findByResetToken(token);

  res.render("reset-password", { userDB, token });
});

export default router;
