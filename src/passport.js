import passport from "passport";
import { usersManager } from "./Dao/MongoDB/users.js";
import { Strategy as strategy } from "passport-local";
import { Strategy as githubStrategy } from "passport-github2";
import { compareData, hashData } from "./utils.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
const jwt_secret = "jwt";

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
      clientSecret: "45edd6841cbcc8b5d6761aa6dbf59f24d3e916cb",
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, false);
      /*  try {
        const userData = await usersManager.findByEmail(profile.email);
        console.log("profile", profile);
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

//jwt
/*
passport.use(
  "jwt",
  new JwtStrategy(
    {
      secretOrKey: jwt_secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwt_payload, done) => {
      console.log("payload", jwt_payload);
      done(null, false);
    }
  )
);
*/
const cookieExtractor = (req) => {
  return req.cookies.token;
};
passport.use(
  "jwt",
  new JwtStrategy(
    {
      secretOrKey: jwt_secret,
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    },
    async (jwt_payload, done) => {
      console.log("payload", jwt_payload);
      done(null, false);
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
