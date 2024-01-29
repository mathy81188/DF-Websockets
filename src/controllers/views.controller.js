import { productManager } from "../Dao/MongoDB/product.js";
import { cartManager } from "../Dao/MongoDB/cart.js";
import UserDTO from "../dto/user.dto.js";
import { usersManager } from "../Dao/MongoDB/users.js";

async function index(req, res) {
  const { email, first_name } = req.session;

  const products = await productManager.find({});
  res.render("index", { products, first_name, email });
}

async function realTimeProducts(req, res) {
  const products = await productManager.find();

  res.render("realTimeProducts", { products });
}

/* comentada por error con passport
async function current(req, res) {
  const currentUser = req.session;
  if (!currentUser) {
    return res.redirect("/login");
  }

  const userDTO = new UserDTO(currentUser);

  res.render("current", { userDTO });
}
*/

async function current(req, res) {
  const currentUser = req.user;

  if (!currentUser) {
    return res.redirect("/login");
  }

  const userDTO = new UserDTO(currentUser);

  res.render("current", { userDTO });
}
async function chat(req, res) {
  res.render("chat");
}

function calculateCartTotal(cart) {
  let total = 0;

  for (const item of cart.products) {
    total += item.quantity * item.product.price;
  }

  return total;
}

async function getCartView(req, res) {
  const { cid } = req.params;
  const cart = await cartManager.findCartById(cid);

  const cartTotal = calculateCartTotal(cart);

  cart.total = cartTotal;
  res.render("cart", { cart });
}

async function loginRender(req, res) {
  res.render("login");
}

async function signUpRender(req, res) {
  res.render("signup");
}

async function resetPasswordRender(req, res) {
  const { token } = req.params;

  const userDB = await usersManager.findByResetToken(token);

  res.render("reset-password", { userDB, token });
}

async function regeneratePasswordEmailRender(req, res) {
  const { token } = req.params;

  const userDB = await usersManager.findByResetToken(token);

  res.render("reset-password", { userDB, token });
}

export {
  index,
  realTimeProducts,
  current,
  chat,
  getCartView,
  loginRender,
  signUpRender,
  resetPasswordRender,
  regeneratePasswordEmailRender,
};
