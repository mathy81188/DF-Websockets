import passport from "passport";
import { usersManager } from "./Dao/MongoDB/users.js";
//import { Strategy as strategy } from "passport-local";
import { Strategy as strategy } from "passport-local";
//import { Strategy as githubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
//import { compareData, hashData } from "./utils.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import config from "./config.js";
import { cartManager } from "./Dao/MongoDB/cart.js";
const jwt_secret = "jwt";

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
