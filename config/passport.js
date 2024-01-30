const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const keys= require('../keyfile.json');


module.exports = function (app) {
    app.use(session({
        secret: keys.web.client_secret, 
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
      clientID: keys.web.client_id,
      clientSecret: keys.web.client_secret,
      callbackURL: "/oauth2callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // Aquí puedes manejar la lógica para almacenar el usuario en tu base de datos
      return done(null, profile);
    }
  ));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
}