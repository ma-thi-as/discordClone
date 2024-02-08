const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const {User} = require('../Models/User');

const client_secret= process.env.google_client_secret
const client_id = process.env.google_clientID


module.exports = function (app) {
    app.use(session({
        secret: client_secret, 
        resave: false,
        saveUninitialized: false
      }));

  
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.use(new GoogleStrategy({
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: "/oauth2callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // Aquí puedes manejar la lógica para almacenar el usuario en tu base de datos
      const user = new User(profile.id, profile.displayName, accessToken, profile.provider);
      user.saveToken()
      return done(null, profile);
    }
  ));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
}