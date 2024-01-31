const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const client_secret= process.env.gclient_secret
const client_id = process.env.gclientID


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
      return done(null, profile);
    }
  ));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
}