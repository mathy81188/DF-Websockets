import passport from "passport";
import { usersManager } from "../Dao/MongoDB/users.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../config/config.js";
import { cartManager } from "../Dao/MongoDB/cart.js";

// Configuración de la estrategia de Google OAuth

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: "http://localhost:8080/api/sessions/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await usersManager.findByEmail(profile._json.email.trim());

        //login
        if (user) {
          // Si el usuario existe pero tiene google:false, actualizarlo a true e ingresar
          if (!user.google) {
            user.google = true;
            // Actualizar la última conexión del usuario
            user.last_connection = new Date();
            await user.save();
            return done(null, user.email, user.role);
          } else {
            // Si el usuario existe y tiene google:true, ingresa
            user.last_connection = new Date();
            await user.save();
            return done(null, user.email);
          }
        } else {
          //signup
          const infoCart = await cartManager.createCart({ products: [] });
          const infolUser = {
            first_name: profile._json.given_name,
            last_name: profile._json.family_name,
            email: profile._json.email,
            password: "",
            cart: infoCart._id,
            google: true,
          };
          const createdUser = await usersManager.createOne(infolUser);

          done(null, createdUser);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // Serializamos el usuario completo en la sesión
  done(null, user);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await usersManager.findByEmail(email);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
