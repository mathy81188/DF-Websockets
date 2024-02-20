import { productManager } from "../Dao/MongoDB/product.js";
import { cartManager } from "../Dao/MongoDB/cart.js";
import UserDTO from "../dto/user.dto.js";
import { usersManager } from "../Dao/MongoDB/users.js";

async function index(req, res) {
  let email, first_name, loggedIn, cartId, isAdmin;

  // Verificar si hay un usuario autenticado a través de Passport
  if (req.user) {
    email = req.user.email;
    first_name = req.user.first_name;
    loggedIn = true;
    cartId = req.user.cart._id;
  } else {
    // Si no hay un usuario autenticado a través de Passport, verificar la sesión
    email = req.session.email;
    first_name = req.session.first_name;
    loggedIn = !!email;

    if (!email) {
      return res.redirect("/login");
    }

    // Obtener el ID del carrito solo si el usuario está autenticado / Verificar si el usuario es administrador
    const user = await usersManager.findByEmail(email);
    cartId = user ? user.cart._id : null;
    isAdmin = user ? user.role === "admin" : false;
  }

  // Obtener productos
  const products = await productManager.find({});

  // Renderizar la vista index con la información obtenida
  res.render("index", {
    products,
    first_name,
    email,
    loggedIn,
    cartId,
    isAdmin,
  });
}

async function realTimeProducts(req, res) {
  // Obtener la información de sesión del usuario
  const userEmail = req.session.email;

  // Obtener los productos
  const products = await productManager.find();

  // Renderizar la vista y pasar la información de sesión y los productos
  res.render("realTimeProducts", { userEmail, products });
}

async function current(req, res) {
  let first_name, email, role, loggedIn;

  // Verificar si hay un usuario autenticado a través de Passport
  if (req.user) {
    first_name = req.user.first_name;
    email = req.user.email;
    role = req.user.role;
    loggedIn = true;
  } else {
    // Si no hay un usuario autenticado a través de Passport, verificar la sesión
    first_name = req.session.first_name;
    email = req.session.email;
    role = req.session.role;
    loggedIn = !!email;
  }

  if (!loggedIn) {
    return res.redirect("/login");
  }

  const userDTO = new UserDTO({ first_name, email, role });

  const showUpgradeButton = userDTO.role === "user";

  res.render("current", { userDTO, loggedIn, showUpgradeButton });
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

  let role, loggedIn;

  // Verificar si hay un usuario autenticado a través de Passport
  if (req.user) {
    role = req.user.role;
    loggedIn = true;
  } else {
    // Si no hay un usuario autenticado a través de Passport, verificar la sesión
    const { email, role: sessionRole } = req.session;
    loggedIn = !!email;
    role = sessionRole;
  }

  // Verificar si el usuario tiene los roles permitidos
  if (!req.user && !req.session.email) {
    return res.redirect("/login");
  }

  res.render("cart", { cart, cid, loggedIn, role });
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

async function upload(req, res) {
  // Puedes obtener el userId desde la sesión u otro lugar
  const { email } = req.session;

  // Buscar al usuario en la base de datos usando el email
  const user = await usersManager.findByEmail(email);

  // Si el usuario existe, obtén su ID
  const userId = user ? user._id : null;

  res.render("uploadImages", { userId });
}

async function upgradePremium(req, res) {
  // Puedes obtener el userId desde la sesión u otro lugar
  const { email } = req.session;

  // Buscar al usuario en la base de datos usando el email
  const user = await usersManager.findByEmail(email);

  // Si el usuario existe, obtén su ID
  const userId = user ? user._id : null;

  res.render("premiumDocs", { userId });
}
async function userAdministrationRender(req, res) {
  let first_name, email, role, loggedIn;

  // Verificar si hay un usuario autenticado a través de Passport
  if (req.user) {
    first_name = req.user.first_name;
    email = req.user.email;
    role = req.user.role;
    loggedIn = true;
  } else {
    // Si no hay un usuario autenticado a través de Passport, verificar la sesión
    first_name = req.session.first_name;
    email = req.session.email;
    role = req.session.role;
    loggedIn = !!email;
  }

  if (!loggedIn) {
    return res.redirect("/login");
  }

  // Verificar si el usuario tiene el rol de administrador
  const isAdmin = role === "admin";

  // Renderizar la vista de administración de usuarios con el navbar
  res.render("adminUsers", { first_name, email, role, loggedIn, isAdmin });
}

async function checkAdminRoleByEmail(req, res) {
  const { email } = req.params;
  const user = await usersManager.findByEmail(email);

  res.json({ user: user });
}
async function administrateUserRoleById(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  const user = await usersManager.updateRoleById(id, role);
  await user.save();

  res.redirect(`/admin/user`);
}

async function deleteUserAccount(req, res) {
  const { id } = req.params;
  // Lógica para eliminar al usuario
  const user = await usersManager.deleteOneById(id);
  res.redirect("/admin/user");
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
  upload,
  upgradePremium,
  userAdministrationRender,
  administrateUserRoleById,
  deleteUserAccount,
  checkAdminRoleByEmail,
};
