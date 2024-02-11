const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { User } = require('../Models/User');

const google_client_secret = process.env.google_client_secret
const google_client_id = process.env.google_clientID

const git_client_id = process.env.git_client_id
const git_client_secret = process.env.git_client_secret

module.exports = function (app) {
  app.use(session({
    secret: google_client_secret,
    resave: false,
    saveUninitialized: false
  }));


  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: google_client_id,
    clientSecret: google_client_secret,
    callbackURL: "/oauth2callback"
  },
    function (accessToken, refreshToken, profile, done) {
      // Aquí puedes manejar la lógica para almacenar el usuario en tu base de datos
      const user = new User(parseInt(profile.id), profile.displayName, accessToken, profile.provider);
      user.saveToken()
      return done(null, profile);
    }
  ));



app.use(passport.initialize());
app.use(passport.session());

}