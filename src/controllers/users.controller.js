import { usersManager } from "../Dao/MongoDB/users.js";
import { cartManager } from "../Dao/MongoDB/cart.js";
import { generateToken, hashData } from "../utils.js";

////////////CONTROLLER/////////////////
async function login(req, res) {
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
}

async function signUp(req, res) {
  const { password, email, first_name, last_name } = req.body;
  if (!password || !email || !first_name || !last_name) {
    res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userDB = await usersManager.findByEmail(email);
    console.log("userdb", userDB);
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
    console.log("createduser", createdUser);
    res.status(200).json({ message: "User created", createdUser });
    //res.redirect("/");
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function logOut(req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}

async function getUserById(req, res) {
  // passport.authenticate("jwt", { session: false }),

  const { id } = req.params;
  try {
    const user = await usersManager.findById(id);

    res.status(200).json({ message: "user found", user });
  } catch (error) {
    res.status(500).json({ error });
  }
}
export { login, signUp, logOut, getUserById };
