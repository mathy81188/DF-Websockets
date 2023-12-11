import { Router } from "express";
import { productManager } from "../Dao/MongoDB/product.js";
import { cartManager } from "../Dao/MongoDB/cart.js";
import UserDTO from "../dto/user.dto.js";

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

//
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}
//
router.get("/current", ensureAuthenticated, (req, res) => {
  /* console.log(req.session);
  if (req.isAuthenticated()) {
    const { email, first_name } = req.user;
    res.render("current", { first_name, email });
  } else {
    res.redirect("/login");
  }*/
  // Obtén el usuario actual del middleware de autenticación (si lo tienes)
  const currentUser = req.user;

  // Crea un DTO con la información no sensible
  const userDTO = new UserDTO(currentUser);

  // Envía el DTO como respuesta
  // res.json(userDTO);
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

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});

export default router;
