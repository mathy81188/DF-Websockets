import passport from "passport";
import { usersManager } from "../Dao/MongoDB/users.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../config/config.js";
import { cartManager } from "../Dao/MongoDB/cart.js";

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: "http://localhost:8080/api/sessions/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      //  console.log("profile", profile);
      try {
        const user = await usersManager.findByEmail(profile._json.email.trim());

        // console.log("user", user);

        //login
        if (user) {
          // req.session.email = user.email;
          // req.session.role = user.role;
          if (user.google) {
            return done(null, user);
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
          //   req.session.email = user.email;
          //   req.session.role = user.role;
          done(null, createdUser);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersManager.findById(id);

    done(null, user);
  } catch (error) {
    done(error);
  }
});

// ...
/*
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

        if (user) {
          
          return done(null, user._id);
        } else {
         
          const infoCart = await cartManager.createCart({ products: [] });
          const infoUser = {
            first_name: profile._json.given_name,
            last_name: profile._json.family_name,
            email: profile._json.email,
            password: "", 
            cart: infoCart._id,
            google: true,
          };

          const createdUser = await usersManager.createOne(infoUser);
          done(null, createdUser._id);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((userId, done) => {
  // Serializamos solo el ID del usuario en la sesión
  done(null, userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersManager.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// ...
*/
