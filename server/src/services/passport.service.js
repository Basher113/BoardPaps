const {Strategy: JwtStrategy,} = require("passport-jwt");
const authConfig = require("../config/auth.config");

const prisma = require("../lib/prisma");

const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.accessToken;
    }
    return token;
};

const passportJwtOpts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: authConfig.access_secret
}

const configPassportJwt = (passport) => {
  passport.use(new JwtStrategy(passportJwtOpts, async (jwtPayload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {id: jwtPayload.userId},
        select: {
          id: true,
          username: true,
          email: true
        }
      });

      if (user) {
        return done(null, user);
      }
      return done(null, false, {message: "No user found"});
    } catch (error) {
      return done(error, false);
    }
  }))
}

module.exports = {configPassportJwt};
