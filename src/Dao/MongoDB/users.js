import bcrypt from "bcrypt";
import { usersModel } from "../../models/users.model.js";
import Manager from "./manager.js";
import crypto from "crypto";
import { transporter } from "../../utils/nodamailer.js";
import { generateToken } from "../../utils.js";

class UsersManager extends Manager {
  constructor() {
    super(usersModel, "cart");
  }

  async getAllUsers(obj) {
    const users = await usersModel.find(obj).populate("cart").lean();

    return users;
  }

  async findById(id) {
    const response = await usersModel.findById(id);
    return response;
  }

  async findByEmail(email) {
    const response = await usersModel.findOne({ email }).populate("cart");
    return response;
  }

  async createOne(obj) {
    const response = await usersModel.create(obj);
    return response;
  }
  ///
  async storePasswordResetToken(email, token, expirationTime) {
    // Add the logic to store the reset token and expiration time in the database
    await usersModel.updateOne(
      { email },
      { $set: { resetToken: token, resetTokenExpiration: expirationTime } }
    );
  }

  async findByResetToken(token) {
    const user = await usersModel.findOne({ resetToken: token });

    // Verificar si el token es válido y no ha expirado
    if (!user || user.resetTokenExpiration < new Date()) {
      return null;
    }

    return user;
    /* try {
      // Find the user by the reset token
      const user = await usersModel.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: new Date() }, // Verificar que el token no haya expirado
      });
      // .populate("cart");
      // Verificar si el token es válido y no ha expirado
      if (!user || user.resetTokenExpiration < new Date()) {
        return null;
      }

      // Return the user data
      return user;
    } catch (error) {
      console.error("Error finding user by reset token:", error);
      throw error; // Throw the error to be handled by the calling code
    }*/
  }
  async clearResetToken(token) {
    await usersModel.updateOne(
      { resetToken: token },
      { $set: { resetToken: null, resetTokenExpiration: null } }
      /*
      { resetToken: token },
      { $unset: { resetToken: "", resetTokenExpiration: "" } }
      */
    );
  }
  async updatePassword(
    email,
    hashedPassword,
    resetToken = null,
    resetTokenExpiration = null
  ) {
    // Update the user's password and clear the reset token
    await usersModel.updateOne(
      { email },
      { $set: { password: hashedPassword, resetToken, resetTokenExpiration } }
    );
  }

  async comparePassword(password, hashedPassword) {
    // Compare the given password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  }
  //
  async requestPasswordReset(email, token) {
    try {
      // Lógica para generar y enviar el correo de restablecimiento de contraseña
      const user = await usersModel.findOne({ email });

      /*  if (!user) {
        throw new Error("User not found");
      }
*/
      // Verificar si ya hay un token generado y no ha expirado
      if (
        user.resetToken &&
        user.resetTokenExpiration &&
        user.resetTokenExpiration >= new Date()
      ) {
        console.log("Token already generated and not expired");
        return { message: "Password recovery email sent successfully" };
      }
      // Generar un token y configurar la URL de restablecimiento
      const token = generateToken({ email, expiration: "1h" });
      await usersManager.updatePassword(
        user.email,
        user.password, // Mantiene la contraseña actual
        token,
        new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hora de expiración
      );

      const resetUrl = `http://localhost:8080/api/users/reset-password/${token}`;

      // Configurar el cuerpo del correo
      const mailOptions = {
        from: "",
        to: email,
        subject: "Restablecimiento de Contraseña",
        text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetUrl}`,
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);

      return { message: "Password reset email sent successfully" };
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      // Encontrar al usuario por el token
      const user = await usersModel.findOne({ resetToken: token });

      // Verificar si el token es válido y no ha expirado
      if (!user || user.resetTokenExpiration < new Date()) {
        throw new Error("Invalid or expired token");
      }

      // Actualizar la contraseña y limpiar el token de restablecimiento
      const hashedPassword = await hashPassword(newPassword); // Asegúrate de tener una función para hashear la contraseña
      await updatePassword(user.email, hashedPassword, null, null);

      return { message: "Password reset successfully" };
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  // Agrega la función de hash de contraseña si no la tienes
  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
export const usersManager = new UsersManager();
