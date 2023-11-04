import passport from "passport";
import { usersManager } from "./Dao/MongoDB/users.js";
import { Strategy as strategy } from "passport-local";
import { Strategy as githubStrategy } from "passport-github2";
import { compareData, hashData } from "./utils.js";

passport.use(
  "signup",
  new strategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const userData = await usersManager.findByEmail(email);

        if (userData) {
          return done(null, false);
        }
        const hashedPass = await hashData(password);
        const createdUser = await usersManager.createOne({
          ...req.body,
          password: hashedPass,
        });

        done(null, createdUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const userData = await usersManager.findByEmail(email);
      if (!userData) {
        return done(null, false);
      }
      const getData = compareData(password, userData.password);
      if (!getData) {
        return done(null, false);
      }
      done(null, userData);
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  "github",
  new githubStrategy(
    {
      clientID: "Iv1.d1887fb60d5192bb",
      clientSecret: "044958df53d08a167623b18b5d4ff208dd8d39f1",
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, false);
      /*  try {
        const userData = await usersManager.findByEmail(profile.email);
        //login
        if (userData) {
          if (userData.github) {
            return done(null, userData);
          } else {
            return done(null, false);
          }
        }
        //signup
        const userNewData = {
          first_name: "matias",
          last_name: "daniel",
          email: profile.email,
          password: "1234",
          github: true,
        };
        const newUser = await usersManager.createOne(userNewData);
        done(null, newUser);
      } catch (error) {
        done(error);
      }*/
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await usersManager.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
