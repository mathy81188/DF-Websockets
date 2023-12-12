import { usersManager } from "../Dao/MongoDB/users.js";
import { cartManager } from "../Dao/MongoDB/cart.js";
import { generateToken, hashData } from "../utils.js";
import UserDTO from "../dto/user.dto.js";

////////////CONTROLLER/////////////////
async function login(req, res) {
  const { email, password } = req.body;
  //const { email } = req.body;
  try {
    const userDB = await usersManager.findByEmail(email);
    if (!userDB) {
      return res.status(401).json({ error: "This email does not exist" });
    }
    req.session.email = email;
    req.session.first_name = userDB.first_name;
    req.session.role = userDB.role;

    /*
    req.session["email"] = email;
    req.session["first_name"] = userDB.first_name;
    req.session["isAdmin"] = userDB.role === "isAdmin" ? true : false;
    res.redirect("/");
    // req.session["isAdmin"] =
    //   email === "adminCoder@coder.com" && password === "Cod3r123"
    //     ? true
    //     : false; */
    const token = generateToken({
      email,
      first_name: userDB.first_name,
      role: userDB.role,
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error });
  }
}
async function signUp(req, res) {
  const { password, email, first_name, last_name } = req.body;
  if (!password || !email || !first_name || !last_name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userDB = await usersManager.findByEmail(email);
    console.log("userdb", userDB);
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

    console.log("createdUser", createdUserResponse);
    res
      .status(200)
      .json({ message: "User created", createdUser: createdUserResponse });
  } catch (error) {
    console.error("Error during signUp:", error);
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
  // passport.authenticate("jwt", { session: false }),

  try {
    const user = await usersManager.findById(id);

    res.status(200).json({ message: "user found", user });
  } catch (error) {
    res.status(500).json({ error });
  }
}
export { login, signUp, logOut, getUserById };
