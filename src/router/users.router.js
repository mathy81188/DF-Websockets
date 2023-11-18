import { Router } from "express";
import { usersManager } from "../Dao/MongoDB/users.js";
import { compareData, hashData } from "../utils.js";
import passport from "passport";
import { generateToken } from "../utils.js";
import { jwtValidation } from "../middlewares/jwt.middewares.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { cartManager } from "../Dao/MongoDB/cart.js";

const router = Router();

router.post("/login", async (req, res) => {
  //const { email, password } = req.body;
  const { email } = req.body;
  try {
    const userDB = await usersManager.findByEmail(email);
    if (!userDB) {
      return res.status(401).json({ error: "This email does not exist" });
    }

    // const comparePass = await compareData(password, userDB.password);
    // if (!comparePass) {
    //   return res.status(401).json({ error: "Incorrect password or email" });
    // }

    const token = generateToken({
      email,
      first_name: userDB.first_name,
      role: userDB.role,
    });
    //  res.status(200).json({ message: ` welcome ${userDB.first_name}`, token });
    res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({ message: ` welcome ${userDB.first_name}`, token });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/signup", async (req, res) => {
  const { password, email, first_name, last_name } = req.body;
  if (!password || !email || !first_name || !last_name) {
    res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userDB = await usersManager.findByEmail(email);
    if (userDB) {
      return res.status(401).json({ message: "This email exists" });
    }
    const cart = await cartManager.createCart({ products: [] });
    const hashedPass = await hashData(password);

    const createdUser = await usersManager.createOne({
      ...req.body,
      cart: cart._id,
      password: hashedPass,
    });
    //res.status(200).json({ message: "User created", createdUser });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.get(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    try {
      const user = await usersManager.findById(id);

      res.status(200).json({ message: "user found", user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

export default router;
