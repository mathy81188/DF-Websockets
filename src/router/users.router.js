import { Router } from "express";
import { usersManager } from "../Dao/MongoDB/users.js";
import { compareData, hashData } from "../utils.js";
const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDB = await usersManager.findByEmail(email);
  if (!userDB) {
    return res.json({ error: "This email does not exist" });
  }
  const comparePass = await compareData(password, userDB.password);
  if (!comparePass) {
    return res.json({ error: "Incorrect password or email" });
  }
  req.session["email"] = email;
  req.session["first_name"] = userDB.first_name;
  req.session["isAdmin"] =
    email === "adminCoder@coder.com" && password === "Cod3r123" ? true : false;
  res.redirect("/");
});

router.post("/signup", async (req, res) => {
  const { password } = req.body;
  const hashedPass = await hashData(password);
  const createdUser = await usersManager.createOne({
    ...req.body,
    password: hashedPass,
  });
  res.status(200).json({ message: "User created", createdUser });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
export default router;
