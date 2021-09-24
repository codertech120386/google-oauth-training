require("dotenv").config();
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const User = require("../models/user.model");

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:2345/auth/google/callback",
  },
  async function(request, accessToken, refreshToken, profile, done) { 
      let user = await User.findOne({email: profile?._json?.email}).lean().exec();
      if(! user) {
          user = await User.create({
              email: profile?._json?.email,
              password: uuidv4()
          })
      }
    return done(null, {user})
  }
));

module.exports = passport;