import { usersManager } from "../Dao/MongoDB/users.js";
import { cartManager } from "../Dao/MongoDB/cart.js";
import { compareData, generateToken, hashData } from "../utils/utils.js";
import UserDTO from "../dto/user.dto.js";
import { messages } from "../errors/error.dictionary.js";
import NotFound from "../errors/not-found.js";
import { logger } from "../utils/winston.js";
import bcrypt from "bcrypt";
import { roles } from "../utils/constants.js";

async function getAllUsers(req, res) {
  try {
    const users = await usersManager.getAllUsers(req.query);
    logger.debug("Usuarios encontrado", users);
    res.status(200).json({ message: "Users found", users });
  } catch (error) {
    logger.error("Error al intentar acceder a todos los users", {
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const userDB = await usersManager.findByEmail(email);
    if (!userDB) {
      throw NotFound.createErr("email");
    }

    const isPasswordValid = await compareData(password, userDB.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: messages.INVALID_PASSWORD });
    }
    req.session.email = email;
    req.session.first_name = userDB.first_name;
    req.session.role = userDB.role;
    // req.session["isAdmin"] =
    //   email === "adminCoder@coder.com" && password === "Cod3r123"
    //     ? true
    //     : false;
    const token = generateToken({
      email,
      first_name: userDB.first_name,
      role: userDB.role,
    });
    res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({
        message: `welcome ${userDB.email}`,
        first_name: userDB.first_name,
        token,
      });

    //res.redirect("/");
  } catch (error) {
    next(error);
  }
}

async function signUp(req, res) {
  const { password, email, first_name, last_name } = req.body;
  if (!password || !email || !first_name || !last_name) {
    return res.status(400).json({ message: messages.FIELDS_REQUIRED });
  }

  try {
    const userDB = await usersManager.findByEmail(email);
    logger.info("userdb", userDB);
    if (userDB) {
      return res.status(401).json({ message: "This email exists" });
    }

    const cart = await cartManager.createCart({ products: [] });
    const hashedPass = await hashData(password);

    const userDto = new UserDTO({
      first_name,
      last_name,
      email,
      password: hashedPass,
      cart,
    });

    const createdUser = await usersManager.createOne(userDto);

    const createdUserResponse = {
      first_name: userDto.first_name,
      last_name: userDto.last_name,
      email: userDto.email,
      password: userDto.password,
      cart: cart._id,
    };

    logger.info("createdUser", createdUserResponse);
    res
      .status(200)
      .json({ message: "User created", createdUser: createdUserResponse });
  } catch (error) {
    logger.error("Error during signUp:", error);
    res.status(500).json({ error });
  }
}

async function logOut(req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}

async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await usersManager.findById(id);

    res.status(200).json({ message: "user found", user });
  } catch (error) {
    res.status(404).json({ error: error.message });
    // res.status(200).json(messages.USER_NOT_FOUND);
  }
}

async function regeneratePasswordReset(req, res, next) {
  const { email, token } = req.params;

  console.log("Token received:", token);

  try {
    const userDB = await usersManager.findByResetToken(token);

    console.log("User found in DB:", userDB);

    res.render("regenerate-password-reset", { token });
  } catch (error) {
    console.error("Error in resetPasswordPage:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function requestPasswordRecovery(req, res, next) {
  const { email } = req.body;

  try {
    await usersManager.requestPasswordReset(email);

    return res.json({ message: "Password recovery email sent successfully" });
  } catch (error) {
    console.error("Error requesting password recovery:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function resetPasswordPage(req, res, next) {
  const { token } = req.params;

  console.log("Token received:", token);

  try {
    const userDB = await usersManager.findByResetToken(token);

    console.log("User found in DB:", userDB);

    res.render("reset-password", { token });
  } catch (error) {
    console.error("Error in resetPasswordPage:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function resetPassword(req, res, next) {
  const { token, newPassword } = req.body;
  console.log("Request body:", req.body);
  try {
    const userDB = await usersManager.findByResetToken(token);

    if (!userDB || userDB.resetTokenExpiration < new Date()) {
      console.log("Invalid or expired token");
      return res.render("regenerate-password-reset");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del usuario en la base de datos
    await usersManager.updatePassword(userDB.email, hashedPassword, null, null);

    // Limpiar el token de reset en la base de datos
    await usersManager.clearResetToken(userDB.email);

    // Redirigir a la página de éxito o inicio de sesión
    return res.redirect("/api/users/logout");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function togglePremiumStatus(req, res) {
  const { uid } = req.params;
  console.log("uid", uid);

  try {
    const user = await usersManager.findById(uid);
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cambiar el estado de premium
    user.role = user.role === roles.USER ? roles.PREMIUM : roles.USER;
    console.log("Premium status updated:", user.role);

    // Guardar los cambios
    await user.save();
    console.log("User saved:", user);

    return res
      .status(200)
      .json({ message: "Premium status updated", isPremium: user.isPremium });
  } catch (error) {
    console.error("Error updating premium status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {
  getAllUsers,
  login,
  signUp,
  logOut,
  getUserById,
  resetPasswordPage,
  regeneratePasswordReset,
  requestPasswordRecovery,
  resetPassword,
  togglePremiumStatus,
};
