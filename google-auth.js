const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');
const { Strategy } = require('passport-http-bearer');

const { User } = require('./db');

/**
 * Function to register google authentication workflow.
 *
 * @param {Object} app
 */
exports.auth = app => {
  app.use(passport.initialize());

  if (process.env.NODE_ENV !== 'test') {
    registerGoogleAuth(app);
    registerBearerAuth();
  } else {
    registerBearerMock();
  }
};

/**
 * A tiny helper to make an endpoint protected.
 */
exports.protect = () => {
  return passport.authenticate('bearer', { session: false });
};

// for further reference
// http://www.passportjs.org/docs/google/
// https://github.com/jaredhanson/passport-google-oauth2
const registerGoogleAuth = app => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // we register the google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
      },
      (token, refreshToken, profile, done) => {
        // here we would store the user information in the db, if the user does not exist.
        let user = User.findOrCreate(profile);
        return done(null, {
          user,
          token
        });
      }
    )
  );

  // This is the endpoint for authentication using google
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/userinfo.profile']
    })
  );

  // Google after successful login call this endpoint. We return
  // the token that should be used to invoke the rest of the API.
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/auth/google'
    }),
    function(req, res) {
      res.json({ token: req.user.token });
    }
  );
};

/**
 * Registers the a bearer token strategy that we will use to protect our API.
 */
const registerBearerAuth = () => {
  // docs
  //    https://github.com/googleapis/google-auth-library-nodejs#oauth2
  //    https://github.com/jaredhanson/passport-http-bearer
  //    https://github.com/passport/express-4.x-http-bearer-example
  //    https://developers.google.com/identity/sign-in/web/backend-auth
  passport.use(
    new Strategy(async (token, cb) => {
      try {
        const client = new OAuth2Client(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          ''
        );
        const tokenInfo = await client.getTokenInfo(token);
        const user = User.findOrCreate({ id: tokenInfo.sub });
        return cb(null, user);
      } catch (error) {
        console.error(error);
        return cb(null, false);
      }
    })
  );
};

const registerBearerMock = () => {
  passport.use(
    new Strategy(async (token, cb) => {
      try {
        const user = User.findOrCreate({ id: token });
        return cb(null, user);
      } catch (error) {
        console.error(error);
        return cb(null, false);
      }
    })
  );
};
